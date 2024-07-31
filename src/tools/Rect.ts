import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Rect extends Tool {
    declare static width: number;
    declare static height: number;

    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        Rect.listen();
    }

    static listen() {
        Rect.canvas.onmouseup = Rect.mouseUpHandler.bind(this);
        Rect.canvas.onmouseleave = Rect.mouseUpHandler.bind(this);
        Rect.canvas.onmousedown = Rect.mouseDownHandler.bind(this);
        Rect.canvas.onmousemove = Rect.mouseMoveHandler.bind(this);
    }

    static mouseUpHandler() {
        super.mouseUpHandler();
        Rect.socket.emit('draw', {
            method: 'draw',
            id: Rect.sessionId,
            figure: {
                type: 'rect',
                x: Rect.startX,
                y: Rect.startY,
                width: Rect.width,
                height: Rect.height,
                fillColor: Rect.ctx!.fillStyle,
                strokeColor: Rect.ctx!.strokeStyle,
                lineWidth: Rect.ctx!.lineWidth
            }
        });
    }
    static mouseDownHandler(event: MouseEvent) {
        Rect.mouseDown = true;
        Rect.ctx!.beginPath();
        Rect.startX = event.pageX - (event.target as HTMLElement).offsetLeft;
        Rect.startY = event.pageY - (event.target as HTMLElement).offsetTop;
        Rect.saved = Rect.canvas.toDataURL();
    }
    static mouseMoveHandler(event: MouseEvent) {
        if (Rect.mouseDown) {
            const currentX = event.pageX - (event.target as HTMLElement).offsetLeft;
            const currentY = event.pageY - (event.target as HTMLElement).offsetTop;
            Rect.width = currentX - Rect.startX;
            Rect.height = currentY - Rect.startY;
            Rect.draw(Rect.startX, Rect.startY, Rect.width, Rect.height);
        }
    }

    static draw(x: number, y: number, w: number, h: number) {
        const img = new Image();
        img.src = Rect.saved;
        img.onload = () => {
            Rect.ctx!.clearRect(0, 0, Rect.canvas.width, Rect.canvas.height);
            Rect.ctx!.drawImage(img, 0, 0, Rect.canvas.width, Rect.canvas.height);
            Rect.ctx!.beginPath();
            Rect.ctx!.rect(x, y, w, h);
            Rect.ctx!.fill();
            Rect.ctx!.stroke();
        };
    }

    static staticDraw(
        x: number,
        y: number,
        w: number,
        h: number,
        colorFill: string,
        colorStroke: string,
        lineWidth: number
    ) {
        Rect.ctx!.lineWidth = lineWidth;
        Rect.ctx!.fillStyle = colorFill;
        Rect.ctx!.strokeStyle = colorStroke;
        Rect.ctx!.beginPath();
        Rect.ctx!.rect(x, y, w, h);
        Rect.ctx!.fill();
        Rect.ctx!.stroke();
    }
}
