const observable = (initial = {}, ...listeners) => {
    const ignore = ['$', 'raw']

    const call = (key, value, previous, operation) => {
        if (ignore.includes(key) || value === previous) return true
        listeners.forEach((listener) => {
            if (typeof listener === 'function') listener?.(key, value, previous, operation)
        })
    }

    const handler = {
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
    }

    const proxy = new Proxy(initial, handler)

    proxy.$ = {}
    proxy.$.subscribe = (listener) => {
        if (listeners.includes(listener)) return
        listeners.push(listener)
    }
    proxy.$.unsubscribe = (listener) => {
        if (!listeners.includes(listener)) return
        listeners.splice(listeners.indexOf(listener), 1)
    }

    return proxy
}

export default observable
