import View from '../../core/view.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Hint extends View {
	static instance

	constructor(props = {}, attrs = {}, classes = []) {
		if (Hint.instance) throw new Error(`Cannot create new 'hint' instance.`)
		super({ props, attrs, classes, styles })

		Hint.instance = this
	}

	static show(view, html, direction = 'bottom') {
		if (!this.instance) return
		// if (this.timeout) {
		// 	clearTimeout(this.timeout)
		// 	this.timeout = null
		// }
		// this.timeout = setTimeout(() => {
		// 	this.hide()
		// }, 2000)
		this.instance.addClass('visible')
		this.instance.node.innerHTML = html
		const margin = 10
		const rect = view.fullRect
		const rect2 = this.instance.fullRect
		let minX, minY, maxX, maxY
		if (direction === 'right') {
			minX = rect.x - (rect2.width - rect.width) / 2
			minY = rect.y + (rect.height - rect2.height) / 2

			if (minY < rect.height) minY = rect.height
		} else if (direction === 'bottom') {
			minX = rect.x - (rect2.width - rect.width) / 2
			minY = rect.y + rect.height + margin
			maxX = window.innerWidth - rect.width - rect2.width
			maxY = window.innerHeight - rect.height - rect2.height

			if (minY < rect.height + margin) minY = rect.height + margin
		}

		if (minX < rect.width + margin) minX = rect.width + margin
		if (minX > maxX) minX = maxX
		if (minY > maxY) minY = maxY

		this.instance.node.style.left = minX + 'px'
		this.instance.node.style.top = minY + 'px'
	}

	static hide() {
		if (!this.instance) return
		this.instance.removeClass('visible')
	}
}

export default Hint
