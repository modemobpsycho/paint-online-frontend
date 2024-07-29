import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Circle extends Tool {
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
    }
    mouseDownHandler(event: MouseEvent) {
        this.mouseDown = true;
        const canvasData = this.canvas.toDataURL();
        this.ctx!.beginPath();
        this.startX = event.pageX - (event.target as HTMLElement).offsetLeft;
        this.startY = event.pageY - (event.target as HTMLElement).offsetTop;
        this.saved = canvasData;
    }
    mouseMoveHandler(event: MouseEvent) {
        if (this.mouseDown) {
            const currentX = event.pageX - (event.target as HTMLElement).offsetLeft;
            const currentY = event.pageY - (event.target as HTMLElement).offsetTop;
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            const r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            this.draw(this.startX, this.startY, r);
        }
    }

    draw(x: number, y: number, r: number) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx!.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx!.beginPath();
            this.ctx!.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx!.fill();
            this.ctx!.stroke();
        };
    }
}
