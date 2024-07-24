import { useEffect, useRef } from 'react'
import useCanvasStore from '../../stores/canvasStore'
import { useToolStore } from '../../stores/toolStore'
import './canvas.scss'
import Brush from '../../tools/Brush'

export default function Canvas() {
	const { setCanvas } = useCanvasStore(state => state)
	const { setTool } = useToolStore(state => state)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		console.log('canvasRef.current', canvasRef.current)
		if (canvasRef.current) {
			setCanvas(canvasRef.current)
		}
		setTool(new Brush(canvasRef.current!))
	}, [])

	return (
		<div className='canvas'>
			<canvas ref={canvasRef} width={800} height={500} />
		</div>
	)
}
