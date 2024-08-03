import View from '../../core/view.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Group extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({ props, attrs, classes, styles })

		const title = new View({
			classes: 'title',
			html: props.title ?? ''
		})

		const content = new View({ classes: 'content' })
		content.append(props.view)

		this.append(title, content)
	}
}

export default Group
