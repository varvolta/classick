type TRect = {
	x: number
	y: number
	width: number
	height: number
}

type TMargin = {
	top: number
	right: number
	bottom: number
	left: number
}

export const marginizeRect = (rect: TRect, margin: TMargin) => {
	return {
		x: rect.x + margin.left,
		y: rect.y + margin.top,
		width: rect.width - margin.left * 2,
		height: rect.height - margin.top * 2
	}
}

export const diffRect = (rect1: TRect, rect2: TRect) => {
	return {
		x: rect1.x - rect2.x,
		y: rect1.y - rect2.y,
		width: rect1.width - rect2.width,
		height: rect1.height - rect2.height
	}
}
