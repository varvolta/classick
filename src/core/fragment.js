import View from './view.js'

class Fragment extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({ props, attrs, classes, type: 'fragment' })
	}
}

export default Fragment
