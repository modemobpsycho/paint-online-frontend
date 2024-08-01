import { Socket } from 'socket.io-client';
import Tool from './Tool';
import useCanvasStore from '../stores/canvasStore';

export default class Line extends Tool {
    static arrX: number[] = [];
    static arrY: number[] = [];

    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        Line.listen();
    }

    static listen() {
        Line.canvas.onmouseup = Line.mouseUpHandler.bind(this);
        Line.canvas.onmouseleave = Line.mouseUpHandler.bind(this);
        Line.canvas.onmousedown = Line.mouseDownHandler.bind(this);
        Line.canvas.onmousemove = Line.mouseMoveHandler.bind(this);
    }

    static mouseUpHandler() {
        if (!Line.mouseDown) {
            return;
        }
        super.mouseUpHandler();
        const figure = {
            type: 'line',
            posX: Line.arrX as number[],
            posY: Line.arrY as number[],
            strokeColor: Line.ctx!.strokeStyle as string,
            lineWidth: Line.ctx!.lineWidth as number
        };

        Line.socket.emit('draw', {
            method: 'draw',
            id: Line.sessionId,
            figure
        });
        const { addDrawing } = useCanvasStore.getState();
        addDrawing({ ...figure, type: 'brush' });

        Line.arrX = [];
        Line.arrY = [];
        Line.socket.emit('draw', {
            method: 'draw',
            id: Line.sessionId,
            figure: {
                type: 'finish'
            }
        });
    }

    static mouseDownHandler(event: MouseEvent) {
        Line.mouseDown = true;
        Line.arrX[0] = event.pageX - (event.target as HTMLElement).offsetLeft;
        Line.arrY[0] = event.pageY - (event.target as HTMLElement).offsetTop;
        Line.ctx!.beginPath();
        Line.ctx!.moveTo(Line.arrX[1], Line.arrY[1]);
        Line.saved = Line.canvas.toDataURL();
    }

    static mouseMoveHandler(event: MouseEvent) {
        if (Line.mouseDown) {
            Line.arrX[1] = event.pageX - (event.target as HTMLElement).offsetLeft;
            Line.arrY[1] = event.pageY - (event.target as HTMLElement).offsetTop;
            Line.draw(Line.arrX[1], Line.arrY[1]);
        }
    }

    static draw(x: number, y: number) {
        const img = new Image();
        img.src = Line.saved;
        img.onload = () => {
            Line.ctx!.clearRect(0, 0, Line.canvas.width, Line.canvas.height);
            Line.ctx!.drawImage(img, 0, 0, Line.canvas.width, Line.canvas.height);
            Line.ctx!.beginPath();
            Line.ctx!.moveTo(Line.arrX[0], Line.arrY[0]);
            Line.ctx!.lineTo(x, y);
            Line.ctx!.stroke();
        };
    }

    static staticDraw(startX: number, startY: number, x: number, y: number, colorStroke: string, lineWidth: number) {
        Line.ctx!.lineWidth = lineWidth;
        Line.ctx!.strokeStyle = colorStroke;

        Line.ctx!.beginPath();
        Line.ctx!.moveTo(startX, startY);
        Line.ctx!.lineTo(x, y);
        Line.ctx!.stroke();
    }
}
