import { useEffect, useRef, useState } from 'react';
import useCanvasStore from '../../stores/canvasStore';
import { useToolStore } from '../../stores/toolStore';
import './canvas.scss';
import Brush from '../../tools/Brush';
import { useParams } from 'react-router-dom';
import Rect from '../../tools/Rect';

export default function Canvas() {
    const { setCanvas, pushToUndo, user, socket, setSessionId, getBoard } = useCanvasStore((state) => state);
    const { setTool, tool } = useToolStore((state) => state);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const params = useParams();
    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 80
    });

    useEffect(() => {
        if (canvasRef.current) {
            setCanvas(canvasRef.current);
        }

        setSessionId(params.id!);
        // setBoard(params.id!);

        window.addEventListener('resize', () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight - 80 });
        });

        getBoard();
        setTool(new Brush(canvasRef.current!, socket, params.id!));

        connectionHandler();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawHandler = (msg: { figure: any }) => {
        const figure = msg.figure;
        const ctx = canvasRef.current!.getContext('2d');
        switch (figure.type) {
            case 'brush':
                Brush.draw(ctx!, figure.x, figure.y);
                break;
            case 'rect':
                Rect.staticDraw(ctx!, figure.x, figure.y, figure.width, figure.height, figure.color);
                break;
            case 'finish':
                ctx!.beginPath();
                break;
        }
    };

    const mouseDownHandler = () => {
        pushToUndo(canvasRef.current!.toDataURL());
    };

    const connectionHandler = () => {
        socket.on('userJoined', (message) => {
            console.log(message);
        });

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('draw', (message) => {
            drawHandler(message);
        });

        if (user && socket) {
            socket.emit('joinRoom', { roomId: params.id, username: user });
        }
    };

    return (
        <div className="canvas">
            <canvas
                onMouseLeave={tool ? () => tool.mouseUpHandler() : undefined}
                onMouseDown={mouseDownHandler}
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
            />
        </div>
    );
}
