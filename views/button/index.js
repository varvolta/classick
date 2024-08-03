import View from '../../core/view.js'
import Hint from '../hint/index.js'
import Icon from '../icon/index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Button extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({
			props,
			attrs,
			styles,
			html: props?.title,
			type: 'button',
			classes: [{ ['no-title']: !props?.title }, ...classes]
		})

		if (props.iconName) {
			const icon = new Icon({
				name: props.iconName,
				flat: props.iconFlat,
				size: props.iconSize,
				color: props.iconColor,
				reverse: props.iconReverse,
				padding: props.iconPadding
			})
			this.prepend(icon)
		}
	}

	onMouseEnter() {
		if (!this.props.hint) return
		Hint.show(this, this.props.hint, this.props.hintDirection)
	}

	onMouseLeave() {
		if (!this.props.hint) return
		Hint.hide()
	}
}

export default Button
