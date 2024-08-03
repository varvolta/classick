import View from '../../core/view.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Menu extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({ props, attrs, classes, styles })
	}
}

export default Menu
