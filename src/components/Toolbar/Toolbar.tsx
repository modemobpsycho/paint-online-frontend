import '../../styles/header.scss'
import BrushIcon from '@mui/icons-material/Brush'
import BoxIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked'
import EraserIcon from '@mui/icons-material/AutoFixHigh'
import LineIcon from '@mui/icons-material/ShowChart'
import UndoIcon from '@mui/icons-material/UndoOutlined'
import RedoIcon from '@mui/icons-material/RedoOutlined'
import SaveIcon from '@mui/icons-material/SaveAltOutlined'
import useToolStore from '../../stores/toolStore'
import useCanvasStore from '../../stores/canvasStore'
import Brush from '../../tools/Brush'
import Rect from '../../tools/Rect'
import Circle from '../../tools/Circle'
import Eraser from '../../tools/Eraser'
import Line from '../../tools/Line'

export default function Toolbar() {
	const { setTool, setFillColor } = useToolStore(state => state)
	const { canvas, redo, undo, socket, sessionId } = useCanvasStore(
		state => state
	)

	const colorHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFillColor(e.target.value)
	}

	const download = () => {
		const dataUrl = canvas!.toDataURL()
		const a = document.createElement('a')
		a.href = dataUrl
		a.download = sessionId + '.jpg'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	return (
		<div className='toolbar'>
			<button
				className='toolbar__button'
				onClick={() => {
					console.log('clicked', canvas, socket, sessionId)
					setTool(new Brush(canvas!, socket!, sessionId))
				}}
			>
				<BrushIcon />
			</button>
			<button
				className='toolbar__button'
				onClick={() => setTool(new Rect(canvas!, socket!, sessionId))}
			>
				<BoxIcon />
			</button>
			<button
				className='toolbar__button'
				onClick={() => setTool(new Circle(canvas!))}
			>
				<CircleIcon />
			</button>
			<button
				className='toolbar__button'
				onClick={() => setTool(new Eraser(canvas!))}
			>
				<EraserIcon />
			</button>
			<button
				className='toolbar__button'
				onClick={() => setTool(new Line(canvas!))}
			>
				<LineIcon />
			</button>
			<input
				style={{ width: '30px', height: '30px', marginLeft: '10px' }}
				type='color'
				onChange={event => colorHandler(event)}
			/>
			<button
				className='toolbar__button'
				style={{ marginLeft: 'auto' }}
				onClick={() => undo()}
			>
				<UndoIcon />
			</button>
			<button className='toolbar__button' onClick={() => redo()}>
				<RedoIcon />
			</button>
			<button
				className='toolbar__button'
				style={{ marginRight: '10px' }}
				onClick={() => download()}
			>
				<SaveIcon />
			</button>
		</div>
	)
}
