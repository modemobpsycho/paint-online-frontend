import { Socket } from 'socket.io-client';

export default class Tool {
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D | null;
    declare static mouseDown: boolean;
    declare static startX: number;
    declare static startY: number;
    declare static saved: string;
    declare static lineWidth: number;
    declare static fillColor: string;
    declare static strokeColor: string;
    declare static socket: Socket;
    declare static sessionId: string;

    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        Tool.canvas = canvas;
        Tool.socket = socket;
        Tool.sessionId = sessionId;
        Tool.ctx = canvas.getContext('2d');
        Tool.ctx!.lineCap = 'round';
        Tool.destroyEvents();
    }

    static setFillColor(color: string) {
        this.ctx!.fillStyle = color;
    }

    static setStrokeColor(color: string) {
        this.ctx!.strokeStyle = color;
    }

    static setLineWidth(width: number) {
        this.ctx!.lineWidth = width;
    }

    static destroyEvents() {
        this.canvas.onmouseup = null;
        this.canvas.onmousedown = null;
        this.canvas.onmousemove = null;
    }

    static mouseUpHandler() {
        this.mouseDown = false;
    }
}
