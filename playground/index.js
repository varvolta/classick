import { View, Document, platform, Styles, Button } from '../src/index.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

// for Electron and Chromium only
// import styles from './styles.css' assert { type: 'css' }

class Text extends View {
	constructor({ html, classes }) {
		super({ html, classes, styles })
	}

	// onState(key, value, previous, operation) {
	// 	console.log({ key, value, previous, operation })
	// }

	_a(...args) {
		// console.log(...args)
	}

}

class Playground extends View {
	constructor() {
		super()
		// console.log(platform())

		const text = new Text({ html: 'TEST TEXT' })
		const button = new Button({})
		this.append(text, button)
		text.props.a = 5
		// text.state.b = 6
		// text.state.c = 50
		// text.state.c = 55

		// console.log('state', text.state)
		// console.log('state.raw', text.state.raw)
	}

}

Document.render(new Playground(), '#root')
