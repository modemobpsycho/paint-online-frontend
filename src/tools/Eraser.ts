import Brush from './Brush'

export default class Eraser extends Brush {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas)
	}

	draw(x: number, y: number) {
		this.ctx!.strokeStyle = 'white'
		this.ctx!.lineTo(x, y)
		this.ctx!.stroke()
	}
}
