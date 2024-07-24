import Tool from './Tool'

export default class Line extends Tool {
	name: string
	currentX!: number
	currentY!: number
	constructor(canvas: HTMLCanvasElement) {
		super(canvas)
		this.listen()
		this.name = 'Line'
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
		this.currentX = event.pageX - (event.target as HTMLElement).offsetLeft
		this.currentY = event.pageY - (event.target as HTMLElement).offsetTop
		this.ctx!.beginPath()
		this.ctx!.moveTo(this.currentX, this.currentY)
		this.saved = this.canvas.toDataURL()
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
		const img = new Image()
		img.src = this.saved
		img.onload = () => {
			this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx!.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
			this.ctx!.beginPath()
			this.ctx!.moveTo(this.currentX, this.currentY)
			this.ctx!.lineTo(x, y)
			this.ctx!.stroke()
		}
	}
}
