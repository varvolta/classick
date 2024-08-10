const attributes = (initial = {}, node: HTMLElement, ...listeners: Function[]) => {
	const proxy = new Proxy(initial, {
		get(_, key: string) {
			return node.getAttribute(key.toLowerCase())
		},
		set(_, key: string, value) {
			node.setAttribute(key.toLowerCase(), value)
			listeners.forEach((listener) => {
				if (typeof listener === 'function') listener(key, value)
			})
			return true
		}
	})

	return proxy
}

export default attributes
