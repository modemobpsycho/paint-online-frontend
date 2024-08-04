import './canvas.scss';
import { useEffect, useRef, useState } from 'react';
import { useToolStore } from '../../stores/toolStore';
import useCanvasStore from '../../stores/canvasStore';
import { useParams } from 'react-router-dom';
import ITool from '../../types/tool.interface';
import Brush from '../../tools/Brush';

export default function Canvas() {
    const { setCanvas, user, socket, setSessionId, getBoard, deleteCurrentBoardUsers, getDrawings } = useCanvasStore(
        (state) => state
    );
    const { setTool } = useToolStore((state) => state);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const params = useParams();
    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth - 40,
        height: window.innerHeight - 120
    });

    useEffect(() => {
        if (canvasRef.current) {
            setCanvas(canvasRef.current);
        }

        setSessionId(params.id!);

        getBoard();

        if (user && socket) {
            socket.emit('joinRoom', { roomId: params.id, username: user });
        }

        setTool(new Brush(canvasRef.current!, socket, params.id!) as ITool);

        window.addEventListener('resize', () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight - 80 });

            getDrawings(Number(params.id!));
        });

        return () => {
            window.removeEventListener('resize', () => {
                setCanvasSize({ width: window.innerWidth, height: window.innerHeight - 80 });
            });
            socket.emit('leaveRoom');
            deleteCurrentBoardUsers(user);
        };
    }, []);

    return (
        <div className="canvas">
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        </div>
    );
}
