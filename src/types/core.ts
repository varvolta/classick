import View from '../core/view.js'

export type TView = Partial<{
	attrs: Record<string, any>
	props: Record<string, any>
	state: Record<string, any>
	styles?: object | string
	classes: string[] | string
	type: string
	content?: string
	children: View[]
}>

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

export type TProxyTarget = Record<string | symbol, any>
