let loaded = false
let listening = false
let callbacks = new Set()

const fontsReady = (callback) => {
    if (loaded) {
        callbacks.delete(callback)
        return callback?.()
    }
    callbacks.add(callback)
    if (!listening) {
        listening = true
        document.fonts.ready.then(({ status }) => {
            if (status === 'loaded') {
                loaded = true
                callbacks.forEach((callback) => callback?.())
                callbacks = undefined
            }
        })
    }
}

export default fontsReady
