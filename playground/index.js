import { View, Document, platform, Import, Router } from '../src/index.js'
const styles = await Import.raw(import.meta.resolve('./styles.css'))

// for Electron and Chromium only
// import styles from './styles.css' assert { type: 'css' }

class Input extends View {
	constructor({ content, classes, attrs }) {
		super({ content, classes, styles, type: 'input', attrs })
	}

	onMount() {
		super.onMount()
		console.log('mounted input')
	}

	onKeyDown(e) {
		console.log('onChange', e.target.value)
		// this.state.name = e.target.value
	}
}

class Playground extends View {
	constructor() {
		super({ state: { hello: 'world' } })
		// console.log(platform())

		// this.state.any = 'Worlds2'

		const input = new Input({
			attrs: {
				value: 'playground'
			}
		})

		this.refs.input = input

		this.append(input)
	}

	// onState(key, value, prev, operation) {
	// 	console.log(key, value, prev, operation)
	// }

	$hello(key, value, prev, operation) {
		console.log(key, value, prev, operation)
	}

	onLayout(rect) {
		console.log(rect)
	}

	onMount() {
		super.onMount()
		console.log('mounted playground')
	}

	onChildMount(child) {
		console.log('mounted playground child')
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
				attrs: {
					value: 'input'
				}
			})
	},
	{
		path: '*',
		view: () => new View({ content: '404' })
	}
]

new Router(routes)
