// Only for V8 engine. Chrome, Electron and Node.

class Caller {
    static getAll() {
        const pst = Error.prepareStackTrace
        Error.prepareStackTrace = function (err, stack) {
            return stack
        }
        const filenames = []
        try {
            const err = new Error()
            while (err.stack.length) {
                const callerfile = err.stack.shift().getFileName()
                if (!filenames.includes(callerfile)) {
                    filenames.push(callerfile)
                }
            }
        } catch (err) {}
        Error.prepareStackTrace = pst

        return filenames
    }

    static get() {
        return this.getAll().pop()
    }
}

export default Caller
