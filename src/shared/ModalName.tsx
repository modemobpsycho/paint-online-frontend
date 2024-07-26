import { Button, Modal } from 'react-bootstrap'
import useCanvasStore from '../stores/canvasStore'
import InputLabel from '@mui/material/InputLabel'
import { Input } from '@mui/material'

function ModalName() {
	const { setUser } = useCanvasStore(state => state)

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<InputLabel>Enter your pretty name!</InputLabel>
				<Input
					type='text'
					onChange={e => {
						setUser(e.target.value)
						setInputValue(e.target.value) // Прокидываем значение ввода обратно
					}}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={connectionHandler}>
					Join
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ModalName
