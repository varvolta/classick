import observable from '../proxies/observable.js'

class Global {
	static state = observable()
}

export default Global
