import ITool from '../types/tool.inteface'

export default class Tool implements ITool {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D | null
	mouseDown!: boolean
	startX!: number
	startY!: number
	saved!: string

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
		this.destroyEvents()
	}

	destroyEvents() {
		this.canvas.onmouseup = null
		this.canvas.onmousedown = null
		this.canvas.onmousemove = null
	}
}
