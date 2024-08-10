import Doc from './doc.js'
import View from './view.js'

type TRoute = {
	path: string
	view: Function
}

export default class Router {
	#routes: TRoute[]

	constructor(routes = []) {
		this.#routes = routes
		window.addEventListener('hashchange', () => this.#redirect())
		this.#redirect()
	}

	#redirect() {
		let path = window.location.hash.replace('#', '')
		if (!path.length) path = '/'
		let view = this.#routes.find((value) => value.path === path)?.view
		if (!view) view = this.#routes.find((value) => value.path === '*')?.view
		if (!view) view = () => new View({ content: '404: Hash location is not handled' })
		Doc.render(view())
	}
}
