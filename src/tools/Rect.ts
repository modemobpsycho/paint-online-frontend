import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Rect extends Tool {
    declare width: number;
    declare height: number;

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
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                colorFill: this.ctx!.fillStyle,
                colorStroke: this.ctx!.strokeStyle,
                lineWidth: this.ctx!.lineWidth
            }
        });
    }
    mouseDownHandler(event: MouseEvent) {
        this.mouseDown = true;
        this.ctx!.beginPath();
        this.startX = event.pageX - (event.target as HTMLElement).offsetLeft;
        this.startY = event.pageY - (event.target as HTMLElement).offsetTop;
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(event: MouseEvent) {
        if (this.mouseDown) {
            const currentX = event.pageX - (event.target as HTMLElement).offsetLeft;
            const currentY = event.pageY - (event.target as HTMLElement).offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    draw(x: number, y: number, w: number, h: number) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx!.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx!.beginPath();
            this.ctx!.rect(x, y, w, h);
            this.ctx!.fill();
            this.ctx!.stroke();
        };
    }

    static staticDraw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        colorFill: string,
        colorStroke: string,
        lineWidth: number
    ) {
        ctx!.lineWidth = lineWidth;
        ctx!.fillStyle = colorFill;
        ctx!.strokeStyle = colorStroke;
        ctx!.beginPath();
        ctx!.rect(x, y, w, h);
        ctx!.fill();
        ctx!.stroke();
    }
}
