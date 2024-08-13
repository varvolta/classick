import { TView } from '../types/core.js'
import View from '../core/ui/view.js'

class Fragment extends View {
	constructor(setup: TView) {
		super({ ...setup, type: 'fragment' })
	}
}

export default Fragment
