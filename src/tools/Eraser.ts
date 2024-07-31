import { Socket } from 'socket.io-client';
import Brush from './Brush';
import { UsetStrokeColor } from '../stores/toolStore';

export default class Eraser extends Brush {
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        UsetStrokeColor('#FFFFFF');
    }

    static staticDrawEraser(x: number, y: number, _color: string, lineWidth: number) {
        Eraser.ctx!.strokeStyle = '#FFFFFF';
        Eraser.ctx!.lineWidth = lineWidth;
        Eraser.ctx!.lineTo(x, y);
        Eraser.ctx!.stroke();
    }
}
