import { kebabCase } from '../utils/cases.js'
import Import from './import.js'

class Styles {

	static add(view, ...styles) {
		styles.forEach((style) => {
			if (style instanceof CSSStyleSheet) {
				document.adoptedStyleSheets.push(style)
			} else if (typeof style === 'object') {
				Styles.apply(view.node, Styles.parse(style))
			} else if (typeof style === 'string') {
				const styleElement = document.createElement('style')
				styleElement.style.display = 'none'
				styleElement.appendChild(document.createTextNode(style))
				document.head.appendChild(styleElement)
			}
		})
	}

	static remove(...styles) {
		styles.forEach((style) => {
			if (style instanceof CSSStyleSheet) {
				document.adoptedStyleSheets.splice(document.adoptedStyleSheets.indexOf(style), 1)
			}
		})
	}

	static var = (name, { value, parse = false, fallback = '' } = {}) => {
		if (!name) return null
		if (!name.startsWith('--')) name = '--' + name
		const element = document.documentElement
		if (value) {
			element.style.setProperty(name, value)
		} else {
			const value = getComputedStyle(element).getPropertyValue(name).trim() ?? fallback
			if (parse) return parseInt(value)
			return value
		}
	}

	static parse(...styles) {
		const combined = {}
		for (const style of styles) {
			for (let [key, value] of Object.entries(style)) {
				const type = typeof value

				if (type !== 'number' && type !== 'string' && type !== 'object') continue

				if (type === 'number' && !key.includes('opacity')) {
					value += key.includes('delay') || key.includes('duration') ? 'ms' : 'px'
				} else if (type === 'object') {
					const entries = Object.entries(value)
					value = entries
						.reduce((all, [fn, args]) => {
							if (Array.isArray(args)) args = args.join(',')
							return `${all} ${fn}(${args})`
						}, '')
						.substring(1)
				}

				combined[kebabCase(key)] = value.toString()
			}
		}
		return combined
	}

	// TODO: Add to string method

	static apply(node, style) {
		for (let [key, value] of Object.entries(style)) {
			node.style[key] = value
		}
	}

	static {
		(async () => {
			this.add(null, await Import.raw(import.meta.resolve('../assets/styles/normalize.css')))
			this.add(null, await Import.raw(import.meta.resolve('../assets/styles/easing.css')))
			this.add(null, await Import.raw(import.meta.resolve('../assets/styles/fonts.css')))
		})()
	}

}

export default Styles
