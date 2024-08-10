import View from './view.js'

class Doc {
	static render(view: View, root: string | HTMLElement = '#root') {
		if (typeof root === 'string') root = document.querySelector(root) as HTMLElement

		if (!(root instanceof HTMLElement)) return

		root.innerHTML = ''

		root.style.position = 'fixed'
		root.style.inset = '0'
		// Fix for vscode liveserver script visibility
		root.style.backgroundColor = 'white'

		root.append(view.node)

		if (!view.parent) view.onMount()

		return view
	}
}

export default Doc
