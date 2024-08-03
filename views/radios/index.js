import View from '../../core/view.js'
import { Button } from '../../index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Radios extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({ props, attrs, classes, styles })

		this.refs.selector = new View({
			classes: ['selector'],
			children: [new View({ classes: ['highlight'] })]
		})

		if ('radios' in props) {
			props.radios.forEach(({ key, icon, flat, color, reverse, hint, hintDirection }, index) => {
				const radio = new Button({ iconName: icon, iconFlat: flat, iconColor: color, iconReverse: reverse, hint, hintDirection }, { onClick: (event) => this.select(key, radio, event) })
				radio.addClass('radio')
				this.append(radio)

				if ('selectedKey' in props ? props.selectedKey === key : index === 0) {
					this.state.selected = { key, radio }
				}
			})
		}

		this.append(this.refs.selector)
	}

	select(key, radio, event) {
		if (this.state.selected.key === key) return
		this.props.onSelect?.(key, radio, event)
		this.state.selected.radio.removeClass('selected')
		this.state.selected = { key, radio }
	}

	$selected(_, { radio }) {
		radio.addClass('selected')
		this.refs.selector.setRect(radio.getRect())
	}

	onLayout() {
		this.refs.selector.setRect(this.state.selected.radio.getRect())
	}
}

export default Radios
