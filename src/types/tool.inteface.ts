interface ITool {
	mouseDown: boolean
	startX: number
    startY: number
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D | null
}

export default ITool
