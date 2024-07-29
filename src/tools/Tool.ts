import { Socket } from 'socket.io-client';
import ITool from '../types/tool.inteface';

export default class Tool implements ITool {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    declare mouseDown: boolean;
    declare startX: number;
    declare startY: number;
    declare saved: string;
    declare lineWidth: number;
    declare fillColor: string;
    declare strokeColor: string;
    declare socket: Socket;
    declare sessionId: string;

    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        this.canvas = canvas;
        this.socket = socket;
        this.sessionId = sessionId;
        this.ctx = canvas.getContext('2d');
        this.destroyEvents();
    }

    setFillColor(color: string) {
        this.ctx!.fillStyle = color;
    }

    setStrokeColor(color: string) {
        this.ctx!.strokeStyle = color;
    }

    setLineWidth(width: number) {
        this.ctx!.lineWidth = width;
    }

    destroyEvents() {
        this.canvas.onmouseup = null;
        this.canvas.onmousedown = null;
        this.canvas.onmousemove = null;
    }

    mouseUpHandler() {
        this.mouseDown = false;
    }
}
