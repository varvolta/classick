import { View, Document, platform, Import, Router } from '../src/index.js'
const styles = await Import.raw(import.meta.resolve('./styles.css'))

// for Electron and Chromium only
// import styles from './styles.css' assert { type: 'css' }

class Input extends View {
	constructor({ content, classes, type, attrs }) {
		super({ content, classes, styles, type, attrs })
	}

	onMount() {
		// console.log('mounted')
		this.state.any = 'ererer'
	}

	$any$hello(...args) {
		console.log(...args)
	}

	_asd() {}

	onChange(e) {
		console.log('onChange', e.target.value)
		// this.state.name = e.target.value
	}
}

class Playground extends View {
	constructor() {
		super()
		// console.log(platform())

		this.state.name = 'Worlds'

		const input = new Input({
			type: 'input',
			classes: 'input-number',
			attrs: {
				value: 'playground',
				onChange: (e) => {
					console.log(e.target.value)
					this.state.name = e.target.value
				}
			}
		})

		this.append(input)
	}

	$name(key, value) {
		console.log(key, value)
	}

	onLayout(rect) {
		console.log(rect)
	}
}

const routes = [
	{
		path: '/',
		view: () => new Playground()
	},
	{
		path: 'input',
		view: () =>
			new Input({
				type: 'input',
				classes: 'input-number',
				attrs: {
					value: 'input'
					// onChange: (e) => {
					// 	console.log(e.target.value)
					// 	this.state.name = e.target.value
					// }
				}
			})
	},
	{
		path: '*',
		view: () => new View({ content: '404' })
	}
]

new Router(routes)
