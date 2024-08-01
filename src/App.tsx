import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/app.scss';
import BoardsPage from './pages/BoardsPage';
import CanvasPage from './pages/CanvasPage';
import HomePage from './pages/HomePage';
import { useEffect } from 'react';
import useCanvasStore from './stores/canvasStore';
import { useDrawHandler } from './helpers/drawing';

function App() {
    const { user, socket, setCurrentBoardUsers, deleteCurrentBoardUsers } = useCanvasStore((state) => state);
    const drawHandler = useDrawHandler();
    useEffect(() => {
        socket.on('userJoined', (username) => {
            console.log('User', username, 'joined the room');

            socket.emit('giveUserInfo', { username: user });

            setCurrentBoardUsers(username);
        });

        socket.on('userLeft', (username) => {
            console.log('User', username, 'left the room');

            deleteCurrentBoardUsers(username);
        });

        socket.on('passUserInfo', (username) => {
            console.log('User', username, 'pass');

            setCurrentBoardUsers(username);
        });

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('draw', (message) => {
            console.log(message.user === user);
            if (message.user === user) return;
            drawHandler(message);
        });
    }, []);
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
