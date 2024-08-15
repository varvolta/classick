import View from '../ui/view.js'

class Doc {
	static render(view: View, dom?: string | HTMLElement) {
		dom ||= document.querySelector('#app') as HTMLElement
		dom ||= document.querySelector('#root') as HTMLElement
		if (typeof dom === 'string') dom = document.querySelector(dom) as HTMLElement

		if (!(dom instanceof HTMLElement)) return

		dom.innerHTML = ''

		dom.style.position = 'fixed'
		dom.style.inset = '0'

		dom.append(view.node)

		if (!view.parent) view.onMount()

		return view
	}
}

export default Doc
