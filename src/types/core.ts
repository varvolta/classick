import View from '../core/ui/view.js'

export type TRect = {
	x: number
	y: number
	width: number
	height: number
}

export type TMargin = {
	top: number
	right: number
	bottom: number
	left: number
}

export type TRoute = {
	path: string
	view: Function
}

export type TSetup = {
	attrs?: Record<string, any>
	props?: Record<string, any>
	state?: Record<string, any>
	styles?: object | string
	classes?: string[] | string
	type?: string
	html?: string
	children?: View[]
}

export type TObservable = Record<string | symbol, any>
