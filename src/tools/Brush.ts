import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Brush extends Tool {
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler() {
        super.mouseUpHandler();
        this.socket.emit('draw', {
            method: 'draw',
            id: this.sessionId,
            figure: {
                type: 'finish'
            }
        });
    }

    mouseDownHandler(event: MouseEvent) {
        this.mouseDown = true;
        this.ctx!.beginPath();
        this.ctx!.moveTo(
            event.pageX - (event.target as HTMLElement).offsetLeft,
            event.pageY - (event.target as HTMLElement).offsetTop
        );
    }
    
    mouseMoveHandler(event: MouseEvent) {
        if (this.mouseDown) {
            this.socket.emit('draw', {
                method: 'draw',
                id: this.sessionId,
                figure: {
                    type: 'brush',
                    x: event.pageX - (event.target as HTMLElement).offsetLeft,
                    y: event.pageY - (event.target as HTMLElement).offsetTop,
                    color: this.ctx!.strokeStyle,
                    lineWidth: this.ctx!.lineWidth,
                    lineCap: this.ctx!.lineCap
                }
            });
        }
    }

    static staticDraw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: string,
        lineWidth: number,
        lineCap: CanvasLineCap
    ) {
        ctx!.lineCap = lineCap;
        ctx!.lineWidth = lineWidth;
        ctx!.strokeStyle = color;
        ctx!.lineTo(x, y);
        ctx!.stroke();
    }
}
