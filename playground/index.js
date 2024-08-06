import { View, Document, platform, Import } from '../src/index.js'
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

	$any(...args) {
		console.log(...args)
	}
}


class Text2 extends View {
	constructor() {
		super()
	}



	// onMount() {
	// 	console.log('mounted')
	// }


	// $hello(...args) {
	// 	console.log(...args)
	// 	// this.state.any = 56
	// }

	// $any(...args) {
	// 	// console.log(...args)
	// 	// this.state.any = 57
	// }

	$hello(_, value) {
		this.setContent(value)
	}

}

class Playground extends View {
	constructor() {
		super()
		console.log(platform())

		this.state.name = 'Tigran'


		const input = new Input({
			type: 'input', classes: 'input-number', attrs: {
				value: 'tigran', onChange: (e) => {
					// console.log(e.target.value)
					this.state.name = e.target.value
				}
			}
		})

		// const text3 = new Text3({ content: 'TEST TEXT 3' })
		// input.node.addEventListener('keypress', (e) => {
		// 	console.log(e)
		// })

		this.refs.text = new Text2()
		// text.state.any = 'world3'

		this.append(input, this.refs.text)

		// text3.state.hello = {
		// 	just: 'world'
		// }
		// text3.state.hello.just = 'world 2'

		// delete text.state.any
		// text.props.asd = 'obj'
		// text.props.asd = 'obj2'
	}

	$name(_, value) {
		this.refs.text.state.hello = value
	}

	onLayout(rect) {
		// console.log(rect)
	}

}

Document.render(new Playground(), '#root')
