import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/app.scss';
import BoardsPage from './pages/BoardsPage';
import CanvasPage from './pages/CanvasPage';
import HomePage from './pages/HomePage';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/:id" element={<CanvasPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<Navigate to={`f${(+new Date()).toString(16)}`} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
