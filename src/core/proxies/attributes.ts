import { TObservable } from '../../types/core.js'

const attributes = (initial = {}, node: HTMLElement, ...listeners: Function[]) => {
	return new Proxy<TObservable>(initial, {
		get(_, key: string) {
			return node.getAttribute(key.toLowerCase())
		},
		set(_, key: string, value) {
			node.setAttribute(key.toLowerCase(), value)
			listeners.forEach((listener) => listener(key, value))
			return true
		}
	})
}

export default attributes
