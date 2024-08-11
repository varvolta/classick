import { TView } from '../types/core.js'
import View from '../core/view.js'

class Fragment extends View {
	constructor(setup: TView) {
		super({ ...setup, type: 'fragment' })
	}
}

export default Fragment
