import { methodsOf } from '../../utils/methods.js'
import attributes from '../proxies/attributes.js'
import cls from '../../utils/cls.js'
import { innerEvents, allEvents } from '../dom/events.js'
import observable from '../proxies/observable.js'
import Styles from '../dom/styles.js'
import { TSetup, TRect, TObservable } from '../../types/core.js'

class View {
	listenersAC = new AbortController()
	type: string
	children: View[]
	parent?: View = undefined
	refs: Record<string, View>
	node: HTMLElement | DocumentFragment
	attrs: TObservable = {}
	props: TObservable
	state: TObservable
	resizeObserver?: ResizeObserver

	constructor({ attrs = {}, props = {}, state = {}, styles, classes = [], type = 'div', content, children = [] }: TSetup = {}) {
		this.type = type
		this.children = children
		this.refs = {}

		if (!Array.isArray(classes) && typeof classes === 'string') {
			classes = classes.split(' ')
		}

		if (type !== 'fragment') {
			this.node = document.createElement(type)
			if (attrs.class) classes.unshift(attrs.class)
			const clss = cls(...classes)
			if (clss.length) this.node.className = clss
		} else {
			this.node = document.createDocumentFragment()
		}

		// Set styles
		if ((styles && typeof styles === 'object') || typeof styles === 'string') {
			if (!Array.isArray(styles)) styles = [styles]
			Styles.add(this, ...(styles as string[]))
		}

		// Set class events
		const methods = methodsOf(this)
		for (const method of methods) {
			if (!method.startsWith('on') || innerEvents.includes(method)) continue
			const eventName = method.slice(2).toLowerCase()
			if (!allEvents.includes(eventName)) continue
			// @ts-ignore
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
				// Check if exists in inner and all methods. If not then do nothing.
				delete attrs[key]
				listener = listener.bind(this)
				this.node.addEventListener(key.slice(2).toLowerCase(), listener, { signal: this.listenersAC.signal })
			}
		}

		// Set props
		this.onProps = this.onProps.bind(this)
		this.props = observable(props, this.onProps)
		// @ts-ignore
		Object.entries(this.props.raw).forEach(([key, current]) => {
			if (key !== '$') this.onProps(key, current, undefined, 'init')
		})

		// Set state
		this.onState = this.onState.bind(this)
		this.state = observable(state, this.onState)
		// @ts-ignore
		Object.entries(this.state.raw).forEach(([key, current]) => {
			if (key !== '$') this.onState(key, current, undefined, 'init')
		})

		// Set html content
		if (content && this.node instanceof HTMLElement) this.node.innerHTML = content

		// Set attributes if not fragment
		if (type !== 'fragment') {
			// TODO: move to attributes file
			// Set 'style' from 'attrs'
			if ('style' in attrs && typeof attrs.style === 'object') {
				Styles.apply(this.node as HTMLElement, Styles.parse(attrs.style))
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

			this.attrs = attributes(attrs, this.node as HTMLElement, this.onAttr)
		}

		// add predefined children and render them
		this.append(...children)
	}

	#observableHandler(key: string, current: any, previous: any, operation: string, getter: string) {
		// Promise.resolve() is needed to skip the first cycle
		if (previous === current) return
		Promise.resolve().then(() => {
			const methods = methodsOf(this)
			// @ts-ignore
			this[getter]?.(key, current, previous, operation)
			for (const method of methods) {
				// Check for chained states keys change
				if (method.includes(getter)) {
					const keys = method.split(getter)
					if (keys.includes(key)) {
						// @ts-ignore
						this[method]?.(key, current, previous, operation)
					}
				}
			}
		})
	}

	getContent() {
		if (this.node instanceof HTMLElement) return this.node.innerHTML
		return null
	}

	setContent(content: string) {
		if (this.node instanceof HTMLElement) this.node.innerHTML = content
	}

	getFullRect() {
		if (this.node instanceof HTMLElement) return this.node.getBoundingClientRect()
	}

	getRect() {
		if (this.node instanceof HTMLElement) {
			const { x, y, width, height } = this.node.getBoundingClientRect()
			if (this.parent) {
				if (this.parent.node instanceof HTMLElement) {
					const rect = this.parent.node.getBoundingClientRect()
					return { x: x - rect.x, y: y - rect.y, width, height }
				}
			} else {
				return { x, y, width, height }
			}
		}
		return null
	}

	setRect(rect: TRect) {
		if (this.node instanceof HTMLElement) {
			this.node.style.left = rect.x + 'px'
			this.node.style.top = rect.y + 'px'
			this.node.style.width = rect.width + 'px'
			this.node.style.height = rect.height + 'px'
		}
	}

	onMount() {
		// Don't allow fragments
		if (!(this.node instanceof HTMLElement)) return

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
		if (!(this.node instanceof HTMLElement)) return

		this.resizeObserver?.disconnect()
	}

	onLayout(rect: TRect) {
		// console.log('onLayout', rect, this.constructor.name)
	}

	onProps(key: string, current: any, previous: any, operation: string) {
		this.#observableHandler(key, current, previous, operation, '_')
	}

	onState(key: string, current: any, previous: any, operation: string) {
		this.#observableHandler(key, current, previous, operation, '$')
	}

	onAttr(key: string, current: any, previous: any, operation: string) {}

	onChildMount(child: View) {}

	remove() {
		if (this.parent) {
			this.parent.children.splice(this.parent.children.indexOf(this), 1)
			this.parent = undefined
			if (this.node instanceof HTMLElement) this.node.remove()
		}
		this.onUnmount()
	}

	append(...views: View[]) {
		views.forEach((view) => {
			if (!view) return
			view.parent = this
			this.children.push(view)
			this.node.append(view.node)
			this.onChildMount(view)
			view.onMount()
		})
		return this
	}

	prepend(...views: View[]) {
		views.reverse()
		views.forEach((view) => {
			if (!view) return
			view.parent = this
			this.children.unshift(view)
			this.node.prepend(view.node)
			this.onChildMount(view)
			view.onMount()
		})
		return this
	}

	appendTo(view: View) {
		this.remove()
		this.parent = view
		view.children.push(this)
		view.node.append(this.node)
		this.onMount()
		view.onChildMount(this)
		return this
	}

	replaceWith(view: View) {
		if (!this.parent) return
		this.parent.node.replaceChild(this.node, view.node)
		this.parent.children[this.parent.children.indexOf(this)] = view
		view.parent = this.parent
		this.parent = undefined
		return this
	}

	addSibling(view: View) {
		if (!this.parent) return
		if (this.parent?.node instanceof HTMLElement) {
			this.parent.node.parentNode?.insertBefore(view.node, this.node.nextSibling)
		}
		const index = this.parent.children.indexOf(this)
		this.parent.children.splice(index + 1, 0, view)
		view.parent = this.parent
		return this
	}

	addClass(...classes: string[]) {
		if (this.node instanceof HTMLElement)
			for (const className of classes) {
				this.node.classList.add(className)
			}
		return this
	}

	removeClass(...classes: string[]) {
		if (this.node instanceof HTMLElement)
			for (const className of classes) {
				this.node.classList.remove(className)
			}
		return this
	}

	clear() {
		this.children = []
		if (this.node instanceof HTMLElement) this.node.innerHTML = ''
		return this
	}

	destroy() {
		this.listenersAC.abort()
		this.remove()
	}
}

export default View
