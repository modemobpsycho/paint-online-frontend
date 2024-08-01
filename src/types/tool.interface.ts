import { Socket } from 'socket.io-client';

export default interface ITool {
    mouseDown: boolean;
    startX: number;
    startY: number;
    lineWidth: number;
    fillColor: string;
    strokeColor: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    socket: Socket;
    sessionId: string;
    mouseUpHandler: () => void;
}
