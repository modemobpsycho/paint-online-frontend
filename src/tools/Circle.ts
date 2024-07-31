import { Socket } from 'socket.io-client';
import Tool from './Tool';

export default class Circle extends Tool {
    declare static width: number;
    declare static height: number;
    declare static r: number;

    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        Circle.listen();
    }

    static listen() {
        Circle.canvas.onmouseup = Circle.mouseUpHandler.bind(this);
        Circle.canvas.onmouseleave = Circle.mouseUpHandler.bind(this);
        Circle.canvas.onmousedown = Circle.mouseDownHandler.bind(this);
        Circle.canvas.onmousemove = Circle.mouseMoveHandler.bind(this);
    }

    static mouseUpHandler() {
        super.mouseUpHandler();
        Circle.socket.emit('draw', {
            method: 'draw',
            id: Circle.sessionId,
            figure: {
                type: 'circle',
                x: Circle.startX,
                y: Circle.startY,
                radius: Math.sqrt(Math.pow(Circle.width, 2) + Math.pow(Circle.height, 2)),
                fillColor: Circle.ctx!.fillStyle,
                strokeColor: Circle.ctx!.strokeStyle,
                lineWidth: Circle.ctx!.lineWidth
            }
        });
    }
    static mouseDownHandler(event: MouseEvent) {
        Circle.mouseDown = true;
        const canvasData = Circle.canvas.toDataURL();
        Circle.ctx!.beginPath();
        Circle.startX = event.pageX - (event.target as HTMLElement).offsetLeft;
        Circle.startY = event.pageY - (event.target as HTMLElement).offsetTop;
        Circle.saved = canvasData;
    }
    static mouseMoveHandler(event: MouseEvent) {
        if (Circle.mouseDown) {
            const currentX = event.pageX - (event.target as HTMLElement).offsetLeft;
            const currentY = event.pageY - (event.target as HTMLElement).offsetTop;
            Circle.width = currentX - Circle.startX;
            Circle.height = currentY - Circle.startY;
            Circle.r = Math.sqrt(Math.pow(Circle.width, 2) + Math.pow(Circle.height, 2));
            Circle.draw(Circle.startX, Circle.startY, Circle.r);
        }
    }

    static draw(x: number, y: number, r: number) {
        const img = new Image();
        img.src = Circle.saved;
        img.onload = () => {
            Circle.ctx!.clearRect(0, 0, Circle.canvas.width, Circle.canvas.height);
            Circle.ctx!.drawImage(img, 0, 0, Circle.canvas.width, Circle.canvas.height);
            Circle.ctx!.beginPath();
            Circle.ctx!.arc(x, y, r, 0, 2 * Math.PI);
            Circle.ctx!.fill();
            Circle.ctx!.stroke();
        };
    }

    static staticDraw(x: number, y: number, r: number, colorStroke: string, colorFill: string, lineWidth: number) {
        Circle.ctx!.lineWidth = lineWidth;
        Circle.ctx!.strokeStyle = colorStroke;
        Circle.ctx!.fillStyle = colorFill;
        Circle.ctx!.beginPath();
        Circle.ctx!.arc(x, y, r, 0, 2 * Math.PI);
        Circle.ctx!.fill();
        Circle.ctx!.stroke();
    }
}
