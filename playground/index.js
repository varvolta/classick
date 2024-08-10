import { View, platform, Import, Router } from '../dist/index.js'
const styles = await Import.raw('styles.css')

// for Electron and Chromium only
// import styles from './styles.css' assert { type: 'css' }

console.log(styles)

class Input extends View {
	constructor({ content, classes, attrs }) {
		super({ content, classes, styles, type: 'input', attrs })
	}

	onMount() {
		super.onMount()
		console.log('mounted input')
	}

	onKeyDown(e) {
		console.log('onKeyDown', e.target.value)
		// this.state.name = e.target.value
	}
}

class Playground extends View {
	constructor() {
		super({ state: { hello: 'world' } })
		console.log(platform())

		// this.state.any = 'Worlds2'

		const input = new Input({
			attrs: {
				value: 'playground'
			}
		})

		input.attrs.az = '5'

		this.refs.input = input

		setTimeout(() => {
			this.state.anything = 'Nothing'
		}, 3000)

		this.append(input)
	}

	// onState(key, value, prev, operation) {
	// 	console.log(key, value, prev, operation)
	// }

	$hello(key, value, prev, operation) {
		console.log(key, value, prev, operation)
	}

	$anything(key, value, prev, operation) {
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
