import { View, Document, platform, Import } from '../src/index.js'
const styles = await Import.raw(import.meta.resolve('./styles.css'))

// for Electron and Chromium only
// import styles from './styles.css' assert { type: 'css' }

class Text extends View {
	constructor({ content, classes }) {
		super({ content, classes, styles })
	}

	onMount() {
		console.log('mounted')
	}

	// onState(key, value, previous, operation) {
	// 	console.log(key, value, previous, operation)
	// }
	//
	$hello$any(...args) {
		console.log(...args)
	}

	// $any(...args) {
	// 	console.log(...args)
	// }
}

class Playground extends View {
	constructor() {
		super()
		console.log(platform())

		const text = new Text({ content: 'TEST TEXT' })
		this.append(text)

		text.state.hello = 'world'
		text.state.any = 'world2'
		// text.props.asd = 'obj'
		// text.props.asd = 'obj2'
	}

}

Document.render(new Playground(), '#root')
