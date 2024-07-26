import {
	Box,
	Button,
	Typography,
	Card,
	CardContent,
	Toolbar,
} from '@mui/material'
import useCanvasStore from '../stores/canvasStore'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function BoardsPage() {
	const { user, setUser, setBoards, boards } = useCanvasStore(state => state)

	useEffect(() => {
		setBoards()
	}, [])

	const changeUsername = () => {
		const newUsername = prompt('Enter your new username:')
		if (newUsername) {
			setUser(newUsername)
		}
	}

	return (
		<Box>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Link to='/'>
					<Typography
						style={{
							display: 'flex',
							alignItems: 'center',
							textDecoration: 'none',
						}}
					>
						<img
							src={'/assets/logo.jpg'}
							alt='Logo'
							style={{
								width: '50px',
								height: '50px',
								marginRight: '10px',
								mixBlendMode: 'multiply',
							}}
						/>
					</Typography>
				</Link>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='h6' sx={{ marginRight: '10px', color: 'white' }}>
						{user
							? 'Hello, ' + user
							: 'Guest' + Math.random().toString(16).slice(10)}
					</Typography>
					<Button color='inherit' variant='contained' onClick={changeUsername}>
						Set Username
					</Button>
				</div>
			</Toolbar>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 'auto',
				}}
			>
				<Button
					variant='contained'
					color='inherit'
					sx={{
						borderRadius: '10px',
					}}
				>
					Create new board
				</Button>
			</Box>
			<div
				style={{
					display: 'flex',
				}}
			>
				<Box sx={{ padding: '20px', width: '100%' }}>
					<Box
						sx={{
							marginTop: '20px',
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
						}}
					>
						{boards.map((board, index) => (
							<Card
								key={index}
								sx={{
									width: 300,
									margin: '10px',
									height: 200,
									borderRadius: '10px',
									boxShadow: '4px 4px 5px gray',
								}}
							>
								<CardContent>
									<Typography variant='h5'>{board.name}</Typography>
									<Typography variant='body2' color='textSecondary'>
										Creator: {board.creator}
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											marginTop: 'auto',
										}}
									>
										<Button
											variant='contained'
											color='inherit'
											sx={{
												width: '80%',
												borderRadius: '10px',
												marginTop: '8vh',
											}}
										>
											Join Room
										</Button>
									</Box>
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>
			</div>
		</Box>
	)
}

export default BoardsPage
