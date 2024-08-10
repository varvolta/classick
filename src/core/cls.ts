const cls = (...classes: any[]): string => {
	const combined = []
	for (let i = 0; i < classes.length; i++) {
		const _class = classes[i]
		if (!_class) continue

		if (typeof _class === 'string') {
			combined.push(_class)
		} else if (Array.isArray(_class)) {
			combined.push(cls(..._class))
		} else {
			Object.entries(_class).forEach(([key, value]) => {
				if (value) combined.push(key)
			})
		}
	}

	return combined.join(' ')
}

export default cls
