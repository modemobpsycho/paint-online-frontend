import { Socket } from 'socket.io-client';
import Brush from './Brush';

export default class Eraser extends Brush {
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        this.ctx!.strokeStyle = 'white';
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

    mouseMoveHandler(event: MouseEvent) {
        if (this.mouseDown) {
            this.socket.emit('draw', {
                method: 'draw',
                id: this.sessionId,
                figure: {
                    type: 'eraser',
                    x: event.pageX - (event.target as HTMLElement).offsetLeft,
                    y: event.pageY - (event.target as HTMLElement).offsetTop,
                    color: this.ctx!.strokeStyle || 'white',
                    lineWidth: this.ctx!.lineWidth
                }
            });
        }
    }

    draw(x: number, y: number) {
        this.ctx!.lineCap = 'round';
        this.ctx!.lineWidth = this.ctx!.lineWidth;
        this.ctx!.strokeStyle = 'white';
        this.ctx!.lineTo(x, y);
        this.ctx!.stroke();
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
        ctx!.lineWidth = lineWidth;
        ctx!.strokeStyle = color;
        ctx!.lineTo(x, y);
        ctx!.stroke();
    }
}
