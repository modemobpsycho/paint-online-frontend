import { Socket } from 'socket.io-client';
import Brush from './Brush';

export default class Eraser extends Brush {
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
    }

    draw(x: number, y: number) {
        this.ctx!.strokeStyle = 'white';
        this.ctx!.lineTo(x, y);
        this.ctx!.stroke();
    }
}
