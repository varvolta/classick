import View from '../ui/view.js'

class Doc {
	static render(view: View, root: string | HTMLElement = '#root') {
		if (typeof root === 'string') root = document.querySelector(root) as HTMLElement

		if (!(root instanceof HTMLElement)) return

		root.innerHTML = ''

		root.style.position = 'fixed'
		root.style.inset = '0'

		root.append(view.node)

		if (!view.parent) view.onMount()

		return view
	}
}

export default Doc
