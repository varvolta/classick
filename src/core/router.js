import Document from './document.js'

export default class Router {
	constructor(routes = []) {
		this.routes = routes

		window.addEventListener('hashchange', () => {
			this.#changeView()
		})

		this.#changeView()
	}

	#changeView() {
		// console.log('Rerouting', document.location.pathname, window.location.hash)
		let path = window.location.hash.replace('#', '')
		if (path.length == 0) path = '/'
		const view = this.routes.find((value) => value.path === path)?.view
		console.log('hashpath', path, view)
		if (view) {
			Document.render(view)
		} else {
			// Display 404 error
			console.log(404)
		}
	}
}
