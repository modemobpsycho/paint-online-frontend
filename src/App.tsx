import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/app.scss'
import Home from './pages/Home'

function App() {
	return (
		<div className='app'>
			<BrowserRouter>
				<Routes>
					<Route path='/*' element={<Home />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
