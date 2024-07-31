import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Line extends Tool {
    static startX: number;
    static startY: number;
    static endX: number;
    static endY: number;
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
        if (Line.mouseDown) {
            super.mouseUpHandler();
            Line.socket.emit('draw', {
                method: 'draw',
                id: Line.sessionId,
                figure: {
                    type: 'line',
                    x: Line.endX,
                    y: Line.endY,
                    startX: Line.startX,
                    startY: Line.startY,
                    strokeColor: Line.ctx!.strokeStyle,
                    lineWidth: Line.ctx!.lineWidth
                }
            });
        }
    }
    static mouseDownHandler(event: MouseEvent) {
        Line.mouseDown = true;
        Line.startX = event.pageX - (event.target as HTMLElement).offsetLeft;
        Line.startY = event.pageY - (event.target as HTMLElement).offsetTop;
        Line.ctx!.beginPath();
        Line.ctx!.moveTo(Line.endX, Line.endY);
        Line.saved = Line.canvas.toDataURL();
    }

    static mouseMoveHandler(event: MouseEvent) {
        if (Line.mouseDown) {
            Line.endX = event.pageX - (event.target as HTMLElement).offsetLeft;
            Line.endY = event.pageY - (event.target as HTMLElement).offsetTop;
            Line.draw(Line.endX, Line.endY);
        }
    }

    static draw(x: number, y: number) {
        const img = new Image();
        img.src = Line.saved;
        img.onload = () => {
            Line.ctx!.clearRect(0, 0, Line.canvas.width, Line.canvas.height);
            Line.ctx!.drawImage(img, 0, 0, Line.canvas.width, Line.canvas.height);
            Line.ctx!.beginPath();
            Line.ctx!.moveTo(Line.startX, Line.startY);
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
