import { kebabCase } from '../utils/cases.js'
import { methodsOf } from '../utils/methods.js'
import attributes from './attributes.js'
import cls from './cls.js'
import { innerEvents, allEvents } from './events.js'
import observable from './observable.js'
import Styles from './styles.js'

class View {
	listenersAC = new AbortController()

	constructor({ attrs = {}, props = {}, state = {}, styles, classes = [], type = 'div', content, children = [] } = {}) {
		this.attrs = attrs
		this.type = type
		this.children = children
		this.parent = null
		this.refs = {}

		if (!Array.isArray(classes) && typeof classes === 'string') {
			classes = classes.split(' ')
		}

		if (type !== 'fragment') {
			this.node = document.createElement(type)
			const className = attrs.class || this.constructor.name !== 'View' ? kebabCase(this.constructor.name) : undefined
			if (className) {
				classes.unshift(className)
			}
			this.node.className = cls(...classes)
		} else {
			// noinspection JSValidateTypes
			this.node = document.createDocumentFragment()
		}

		// Set styles
		if (typeof styles === 'object' || typeof styles === 'string') {
			if (!Array.isArray(styles)) styles = [styles]
			Styles.add(this, ...styles)
		}

		// Set class events
		const methods = methodsOf(this)
		for (const method of methods) {
			if (!method.startsWith('on') || innerEvents.includes(method)) continue
			const eventName = method.slice(2).toLowerCase()
			if (!allEvents.includes(eventName)) continue
			const listener = this[method].bind(this)
			this.node.addEventListener(
				eventName,
				(event) => {
					// TODO: Check if propagation canceling is ok
					event.stopPropagation()
					listener(event)
				},
				{ signal: this.listenersAC.signal }
			)
		}

		// Set argument events
		for (let [key, listener] of Object.entries(attrs)) {
			if (key.startsWith('on')) {
				delete attrs[key]
				listener = listener.bind(this)
				this.node.addEventListener(key.slice(2).toLowerCase(), listener, { signal: this.listenersAC.signal })
			}
		}

		// Set props
		this.onProps = this.onProps.bind(this)
		this.props = observable(props, this.onProps)
		Object.entries(this.props.raw).forEach(([key, value]) => {
			if (key !== '$') this.onProps(key, value, undefined, 'init')
		})

		// Set state
		this.onState = this.onState.bind(this)
		this.state = observable(state, this.onState)
		Object.entries(this.state.raw).forEach(([key, value]) => {
			if (key !== '$') this.onState(key, value, undefined, 'init')
		})

		// Set html content
		if (content) this.node.innerHTML = content

		// Set attributes if not fragment
		if (type !== 'fragment') {
			// Set 'style' from 'attrs'
			if ('style' in attrs && typeof attrs.style === 'object') {
				Styles.apply(this.node, Styles.parse(attrs.style))
				delete attrs.style
			}

			// Set 'data' attributes from 'attrs'
			if ('data' in attrs && typeof attrs.data === 'object') {
				for (const [key, value] of Object.entries(attrs.data)) {
					attrs[`data-${key}`] = value
				}
				delete attrs.data
			}

			// Set 'aria' attributes from 'attrs'
			if ('aria' in attrs && typeof attrs.aria === 'object') {
				for (const [key, value] of Object.entries(attrs.aria)) {
					attrs[`aria-${key}`] = value
				}
				delete attrs.aria
			}

			this.attrs = attributes(attrs, this.node, this.onAttr)
		}

		// add predefined children and render them
		this.append(...children)
	}

	#observableHandler(key, value, previous, operation, getter) {
		// Promise.resolve() or setTimeout is needed to skip the first cycle
		Promise.resolve().then(() => {
			if (previous === value) return
			const methods = methodsOf(this)
			this[getter]?.(key, value, previous, operation)
			for (const method of methods) {
				// Check for chained states keys change
				if (method.includes(getter)) {
					const keys = method.split(getter)
					if (keys.includes(key)) {
						this[method]?.(key, value, previous, operation)
					}
				}
			}
		})
	}

	getContent() {
		return this.node.innerHTML
	}

	setContent(content) {
		this.node.innerHTML = content
	}

	getFullRect() {
		return this.node.getBoundingClientRect()
	}

	getRect() {
		const { x, y, width, height } = this.node.getBoundingClientRect()
		if (this.parent) {
			const rect = this.parent.node.getBoundingClientRect()
			return { x: x - rect.x, y: y - rect.y, width, height }
		} else {
			return { x, y, width, height }
		}
	}

	setRect(rect) {
		this.node.style.left = rect.x + 'px'
		this.node.style.top = rect.y + 'px'
		this.node.style.width = rect.width + 'px'
		this.node.style.height = rect.height + 'px'
	}

	onMount() {
		// Don't allow fragments
		if (!(this.node instanceof Element)) return

		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentRect) {
					this.onLayout(entry.contentRect.toJSON())
				}
			}
		})
		this.resizeObserver.observe(this.node)
	}

	onUnmount() {
		// Don't allow fragments
		if (!(this.node instanceof Element)) return

		this.resizeObserver?.disconnect()
	}

	onLayout(rect) {
		// console.log('onLayout', rect, this.constructor.name)
	}

	onProps(key, value, previous, operation) {
		this.#observableHandler(key, value, previous, operation, '_')
	}

	onState(key, value, previous, operation) {
		this.#observableHandler(key, value, previous, operation, '$')
	}

	onAttr(key, value) {}

	onChildMount(child) {}

	remove() {
		if (this.parent) {
			this.parent.children.splice(this.parent.children.indexOf(this), 1)
			this.parent = null
			this.node.remove()
		}
		this.onUnmount()
	}

	insertAt(index, view) {}

	removeAt(index) {}

	append(...views) {
		views.forEach((view) => {
			if (view) {
				view.parent = this
				this.children.push(view)
				this.node.append(view.node)
				this.onChildMount(view)
				view.onMount()
			}
		})
		return this
	}

	prepend(...views) {
		views.reverse()
		views.forEach((view) => {
			if (!view) return
			view.parent = this
			this.children.unshift(view)
			this.node.prepend(view.node)
			view.onMount()
		})
		return this
	}

	appendTo(view) {
		this.remove()
		this.parent = view
		view.children.push(this)
		view.node.append(this.node)
		this.onMount()
		return this
	}

	replaceWith(view) {
		this.parent.node.replaceChild(this.node, view.node)
		this.parent.children[this.parent.children.indexOf(this)] = view
		view.parent = this.parent
		this.parent = null
		return this
	}

	addSibling(view) {
		this.parent.node.parentNode.insertBefore(view.node, this.node.nextSibling)
		const index = this.parent.children.indexOf(this)
		this.parent.children.splice(index + 1, 0, view)
		view.parent = this.parent
		return this
	}

	addClass(...classes) {
		for (const className of classes) {
			this.node.classList.add(className)
		}
		return this
	}

	removeClass(...classes) {
		for (const className of classes) {
			this.node.classList.remove(className)
		}
		return this
	}

	clear() {
		this.children = []
		this.node.innerHTML = ''
		return this
	}

	destroy() {
		this.listenersAC.abort()
		this.remove()
	}
}

export default View
