import View from '../../core/view.js'
import { Button } from '../../index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Toolbar extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({ props, attrs, classes, styles })

		const title = new View({ html: props.title || '' })

		const createButtons = (buttons) => {
			if (!Array.isArray(buttons)) return []
			const list = []
			for (const { key, icon, flat, color, hint, reverse, onClick } of buttons) {
				const button = new Button(
					{
						iconName: icon,
						iconFlat: flat,
						iconColor: color,
						iconReverse: reverse,
						hint
					},
					{
						onClick: (event) => {
							onClick?.(event)
							props.onButtonClick?.(key, event)
						}
					}
				)
				list.push(button)
			}
			return list
		}

		const left = createButtons(props.left)
		const right = createButtons(props.right)

		this.append(...left, title, ...right)
	}
}

export default Toolbar
