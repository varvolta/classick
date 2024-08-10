const ignore = ['$', 'raw']

type TTarget = Record<string | symbol, any>

const observable = (initial = {}, ...listeners: Function[]) => {
	const call = (key: string | symbol, value: any, previous: any, operation: string) => {
		if (typeof key === 'string' && (ignore.includes(key) || value === previous)) return true
		listeners.forEach((listener) => {
			if (typeof listener === 'function') listener?.(key, value, previous, operation)
		})
	}

	const proxy = new Proxy<TTarget>(initial, {
		get(target, key) {
			if (key === 'observable') return true
			if (key === 'listeners') return listeners
			if (key === 'raw') return target

			return target[key]
		},
		set(target, key, value) {
			const previous = target[key]

			target[key] = value
			call(key, value, previous, 'change')

			return true
		},
		has(target, key) {
			return key in target
		},
		deleteProperty(target, key) {
			call(key, undefined, target[key], 'delete')
			return delete target[key]
		}
	})

	proxy.$ = {
		subscribe(listener: Function) {
			if (listeners.includes(listener)) return
			listeners.push(listener)
		},
		unsubscribe(listener: Function) {
			if (!listeners.includes(listener)) return
			listeners.splice(listeners.indexOf(listener), 1)
		}
	}

	return proxy
}

export default observable
