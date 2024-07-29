import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/app.scss';
import Home from './pages/Home';
import Board from './pages/Board';
import BoardsPage from './pages/BoardsPage';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/:id" element={<Board />} />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate to={`f${(+new Date()).toString(16)}`} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
