import { useEffect, useRef } from 'react'
import useCanvasStore from '../../stores/canvasStore'
import { useToolStore } from '../../stores/toolStore'
import './canvas.scss'
import Brush from '../../tools/Brush'
import { Button, Modal } from 'react-bootstrap'
import { Input, InputLabel } from '@mui/material'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import Rect from '../../tools/Rect'

export default function Canvas() {
	const {
		setCanvas,
		modal,
		setModal,
		setUser,
		pushToUndo,
		user,
		setSocket,
		socket,
		setSessionId,
	} = useCanvasStore(state => state)
	const { setTool } = useToolStore(state => state)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const params = useParams()

	useEffect(() => {
		if (canvasRef.current) {
			setCanvas(canvasRef.current)
		}

		const socket = io('http://localhost:3000')

		setTool(new Brush(canvasRef.current!, socket, params.id!))
		setSessionId(params.id!)

		socket.on('userJoined', message => {
			console.log(message)
		})

		socket.on('connect', () => {
			console.log('connected1111111')
		})

		socket.on('draw', message => {
			drawHandler(message)
		})

		socket.connect()
		setSocket(socket)
	}, [])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const drawHandler = (msg: { figure: any }) => {
		const figure = msg.figure
		const ctx = canvasRef.current!.getContext('2d')
		switch (figure.type) {
			case 'brush':
				Brush.draw(ctx!, figure.x, figure.y)
				break
			case 'rect':
				Rect.staticDraw(
					ctx!,
					figure.x,
					figure.y,
					figure.width,
					figure.height,
					figure.color
				)
				break
			case 'finish':
				ctx!.beginPath()
				break
		}
	}

	const mouseDownHandler = () => {
		pushToUndo(canvasRef.current!.toDataURL())
	}

	const connectionHandler = () => {
		if (user && socket) {
			socket.emit('joinRoom', { roomId: params.id, username: user })
		}

		setModal(false)
	}

	return (
		<div className='canvas'>
			<Modal show={modal} onHide={() => {}}>
				<Modal.Header closeButton>
					<Modal.Title>BOO!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputLabel>Enter your pretty name!</InputLabel>
					<Input
						type='text'
						onChange={e => {
							setUser(e.target.value)
						}}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => connectionHandler()}>
						Join
					</Button>
				</Modal.Footer>
			</Modal>
			<canvas
				onMouseDown={() => mouseDownHandler()}
				ref={canvasRef}
				width={800}
				height={500}
			/>
		</div>
	)
}
