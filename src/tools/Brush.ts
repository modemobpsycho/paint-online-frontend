import Tool from './Tool'

export default class Brush extends Tool {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas)
		this.listen()
	}

	listen() {
		this.canvas.onmouseup = this.mouseUpHandler.bind(this)
		this.canvas.onmousedown = this.mouseDownHandler.bind(this)
		this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
	}

	mouseUpHandler() {
		this.mouseDown = false
	}
	mouseDownHandler(event: MouseEvent) {
		this.mouseDown = true
		this.ctx!.beginPath()
		this.ctx!.moveTo(
			event.pageX - (event.target as HTMLElement).offsetLeft,
			event.pageY - (event.target as HTMLElement).offsetTop
		)
	}
	mouseMoveHandler(event: MouseEvent) {
		if (this.mouseDown) {
			this.draw(
				event.pageX - (event.target as HTMLElement).offsetLeft,
				event.pageY - (event.target as HTMLElement).offsetTop
			)
		}
	}

	draw(x: number, y: number) {
		this.ctx!.lineTo(x, y)
		this.ctx!.stroke()
		console.log(x, y)
		console.log('drawing')
	}
}
