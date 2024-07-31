import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Brush extends Tool {
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        Brush.listen();
    }

    static listen() {
        Brush.canvas.onmouseup = this.mouseUpHandler.bind(this);
        Brush.canvas.onmouseleave = this.mouseUpHandler.bind(this);
        Brush.canvas.onmousedown = this.mouseDownHandler.bind(this);
        Brush.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    static mouseUpHandler() {
        super.mouseUpHandler();
        Brush.socket.emit('draw', {
            method: 'draw',
            id: Brush.sessionId,
            figure: {
                type: 'finish'
            }
        });
    }

    static mouseDownHandler(event: MouseEvent) {
        Brush.mouseDown = true;
        Brush.ctx!.beginPath();
        Brush.ctx!.moveTo(
            event.pageX - (event.target as HTMLElement).offsetLeft,
            event.pageY - (event.target as HTMLElement).offsetTop
        );
    }

    static mouseMoveHandler(event: MouseEvent) {
        if (Brush.mouseDown) {
            Brush.socket.emit('draw', {
                method: 'draw',
                id: Brush.sessionId,
                figure: {
                    type: 'brush',
                    posX: event.pageX - (event.target as HTMLElement).offsetLeft,
                    posY: event.pageY - (event.target as HTMLElement).offsetTop,
                    strokeColor: Brush.ctx!.strokeStyle,
                    lineWidth: Brush.ctx!.lineWidth,
                    lineCap: Brush.ctx!.lineCap
                }
            });
        }
    }

    static staticDraw(x: number, y: number, color: string, lineWidth: number) {
        Brush.ctx!.lineWidth = lineWidth;
        Brush.ctx!.strokeStyle = color;
        Brush.ctx!.lineTo(x, y);
        Brush.ctx!.stroke();
    }
}
