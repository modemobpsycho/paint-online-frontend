import { Socket } from 'socket.io-client';
import Brush from './Brush';
import { toolStrokeColor } from '../stores/toolStore';

export default class Eraser extends Brush {
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        toolStrokeColor('#FFFFFF');
    }
}
