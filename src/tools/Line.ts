import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Line extends Tool {
    name: string;
    currentX!: number;
    currentY!: number;
    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        this.listen();
        this.name = 'Line';
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
                type: 'line',
                x: this.currentX,
                y: this.currentY,
                color: this.ctx!.strokeStyle,
                lineWidth: this.ctx!.lineWidth
            }
        });
    }
    mouseDownHandler(event: MouseEvent) {
        this.mouseDown = true;
        this.currentX = event.pageX - (event.target as HTMLElement).offsetLeft;
        this.currentY = event.pageY - (event.target as HTMLElement).offsetTop;
        this.ctx!.beginPath();
        this.ctx!.moveTo(this.currentX, this.currentY);
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(event: MouseEvent) {
        if (this.mouseDown) {
            this.draw(
                event.pageX - (event.target as HTMLElement).offsetLeft,
                event.pageY - (event.target as HTMLElement).offsetTop
            );
        }
    }

    draw(x: number, y: number) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx!.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx!.beginPath();
            this.ctx!.moveTo(this.currentX, this.currentY);
            this.ctx!.lineTo(x, y);
            this.ctx!.stroke();
        };
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, lineWidth: number) {
        ctx!.lineWidth = lineWidth;
        ctx!.strokeStyle = color;
        ctx!.lineTo(x, y);
        ctx!.stroke();
    }
}
