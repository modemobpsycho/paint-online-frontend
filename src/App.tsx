import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/app.scss';
import BoardsPage from './pages/BoardsPage';
import CanvasPage from './pages/CanvasPage';
import HomePage from './pages/HomePage';
import { useEffect } from 'react';
import useCanvasStore from './stores/canvasStore';
import { useDrawHandler } from './helpers/drawing';

function App() {
    const { user, socket, setCurrentBoardUsers, deleteCurrentBoardUsers, getDrawings } = useCanvasStore(
        (state) => state
    );
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
            setCurrentBoardUsers(username);
        });

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('draw', (message) => {
            if (message.user === user) return;
            drawHandler(message);
        });

        socket.on('cancelDraw', (message) => {
            // if (message.figure.userId === user) return;

            getDrawings(Number(message.id));
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
