import useCanvasStore from '../../stores/canvasStore'
import useToolStore from '../../stores/toolStore'
import '../../styles/header.scss'

export default function SettingBar() {
	const { setLineWidth, setStrokeColor } = useToolStore(state => state)
	const { user } = useCanvasStore(state => state)

	return (
		<div className='setting-bar'>
			<label htmlFor='fill-color'>Line width:</label>
			<input
				style={{ margin: '0 10px' }}
				id='line-width'
				type='number'
				defaultValue={1}
				min={0}
				max={50}
				onChange={e => setLineWidth(Number(e.target.value))}
			/>

			<label htmlFor='stroke-color'>Stroke color: </label>
			<input
				style={{ margin: '0 10px' }}
				id='stroke-color'
				type='color'
				onChange={e => setStrokeColor(e.target.value)}
			/>
			{user && <label>Hello, {user}</label>}
		</div>
	)
}
