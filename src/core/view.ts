import { kebabCase } from '../utils/cases.js'
import { methodsOf } from '../utils/methods.js'
import attributes from './attributes.js'
import cls from './cls.js'
import { innerEvents, allEvents } from './events.js'
import observable from './observable.js'
import Styles from './styles.js'

type TView = Partial<{
	attrs: Record<string, any>
	props: Record<string, any>
	state: Record<string, any>
	styles: object | string | null
	classes: string[] | string
	type: string
	content: string | null
	children: View[]
}>

type TRect = {
	x: number
	y: number
	width: number
	height: number
}

class View {
	listenersAC = new AbortController()
	type: string
	children: View[]
	parent: View | null
	refs: Record<string, View>
	node: HTMLElement | DocumentFragment
	attrs: ProxyHandler<object> = {}
	props: ProxyHandler<object>
	state: ProxyHandler<object>
	resizeObserver: ResizeObserver | null = null

	constructor({ attrs = {}, props = {}, state = {}, styles = null, classes = [], type = 'div', content, children = [] }: TView = {}) {
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
				delete attrs[key]
				listener = listener.bind(this)
				this.node.addEventListener(key.slice(2).toLowerCase(), listener, { signal: this.listenersAC.signal })
			}
		}

		// Set props
		this.onProps = this.onProps.bind(this)
		this.props = observable(props, this.onProps)
		// @ts-ignore
		Object.entries(this.props.raw).forEach(([key, value]) => {
			if (key !== '$') this.onProps(key, value, undefined, 'init')
		})

		// Set state
		this.onState = this.onState.bind(this)
		this.state = observable(state, this.onState)
		// @ts-ignore
		Object.entries(this.state.raw).forEach(([key, value]) => {
			if (key !== '$') this.onState(key, value, undefined, 'init')
		})

		// Set html content
		if (content && this.node instanceof HTMLElement) this.node.innerHTML = content

		// Set attributes if not fragment
		if (type !== 'fragment') {
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

	#observableHandler(key: string, value: any, previous: any, operation: string, getter: string) {
		// Promise.resolve() or setTimeout is needed to skip the first cycle
		Promise.resolve().then(() => {
			if (previous === value) return
			const methods = methodsOf(this)
			// @ts-ignore
			this[getter]?.(key, value, previous, operation)
			for (const method of methods) {
				// Check for chained states keys change
				if (method.includes(getter)) {
					const keys = method.split(getter)
					if (keys.includes(key)) {
						// @ts-ignore
						this[method]?.(key, value, previous, operation)
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

	onLayout(rect: TRect) {
		// console.log('onLayout', rect, this.constructor.name)
	}

	onProps(key: string, value: any, previous: any, operation: string) {
		this.#observableHandler(key, value, previous, operation, '_')
	}

	onState(key: string, value: any, previous: any, operation: string) {
		this.#observableHandler(key, value, previous, operation, '$')
	}

	onAttr(key: string, value: any, previous: any, operation: string) {}

	onChildMount(child: View) {}

	remove() {
		if (this.parent) {
			this.parent.children.splice(this.parent.children.indexOf(this), 1)
			this.parent = null
			if (this.node instanceof HTMLElement) this.node.remove()
		}
		this.onUnmount()
	}

	insertAt(index: number, view: View) {}

	removeAt(index: number) {}

	append(...views: View[]) {
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

	prepend(...views: View[]) {
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

	appendTo(view: View) {
		this.remove()
		this.parent = view
		view.children.push(this)
		view.node.append(this.node)
		this.onMount()
		return this
	}

	replaceWith(view: View) {
		if (!this.parent) return
		this.parent.node.replaceChild(this.node, view.node)
		this.parent.children[this.parent.children.indexOf(this)] = view
		view.parent = this.parent
		this.parent = null
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
