import observable from './observable.js'

class Global {
	static state = observable({})
}

export default Global