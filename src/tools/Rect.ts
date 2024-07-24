import Tool from './Tool'

export default class Rect extends Tool {
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
		this.startX = event.pageX - (event.target as HTMLElement).offsetLeft
		this.startY = event.pageY - (event.target as HTMLElement).offsetTop
		this.saved = this.canvas.toDataURL()
	}
	mouseMoveHandler(event: MouseEvent) {
		if (this.mouseDown) {
			const currentX = event.pageX - (event.target as HTMLElement).offsetLeft
			const currentY = event.pageY - (event.target as HTMLElement).offsetTop
			const width = currentX - this.startX
			const height = currentY - this.startY
			this.draw(this.startX, this.startY, width, height)
		}
	}

	draw(x: number, y: number, w: number, h: number) {
		const img = new Image()
		img.src = this.saved
		img.onload = () => {
			this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx!.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
			this.ctx!.beginPath()
			this.ctx!.rect(x, y, w, h)
			this.ctx!.fill()
			this.ctx!.stroke()
		}
	}
}
