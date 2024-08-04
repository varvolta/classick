const attributes = (initial = {}, node, ...listeners) => {
	const proxy = new Proxy(
		{},
		{
			get(_, key) {
				return node.getAttribute(key.toLowerCase())
			},
			set(_, key, value) {
				node.setAttribute(key.toLowerCase(), value)
				listeners.forEach((listener) => {
					if (typeof listener === 'function') listener(key, value)
				})
				return true
			}
		}
	)

	for (const [key, value] of Object.entries(initial)) {
		proxy[key] = value
	}

	return proxy
}

export default attributes
