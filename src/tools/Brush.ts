import { Socket } from 'socket.io-client'
import Tool from './Tool'

export default class Brush extends Tool {
	constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
		super(canvas, socket, sessionId)
		this.listen()
		this.ctx!.lineCap = 'round'
	}

	listen() {
		this.canvas.onmouseup = this.mouseUpHandler.bind(this)
		this.canvas.onmousedown = this.mouseDownHandler.bind(this)
		this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
	}

	setFillColor(color: string) {
		this.ctx!.fillStyle = color
	}

	mouseUpHandler() {
		this.mouseDown = false
		this.socket.emit('draw', {
			method: 'draw',
			id: this.sessionId,
			figure: {
				type: 'finish',
			},
		})
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
			this.socket.emit('draw', {
				method: 'draw',
				id: this.sessionId,
				figure: {
					type: 'brush',
					x: event.pageX - (event.target as HTMLElement).offsetLeft,
					y: event.pageY - (event.target as HTMLElement).offsetTop,
				},
			})
		}
	}

	static draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx!.lineTo(x, y)
		ctx!.stroke()
	}
}
