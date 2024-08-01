import { Socket } from 'socket.io-client';
import Tool from './Tool';
import useCanvasStore from '../stores/canvasStore';

export default class Circle extends Tool {
    static arrX: number[] = [];
    static arrY: number[] = [];

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
        if (!Circle.mouseDown) {
            return;
        }
        super.mouseUpHandler();
        const figure = {
            type: 'circle',
            posX: [Circle.arrX[0], Circle.arrX.at(-1) as number],
            posY: [Circle.arrY[0], Circle.arrY.at(-1) as number],
            fillColor: Circle.ctx!.fillStyle as string,
            strokeColor: Circle.ctx!.strokeStyle as string,
            lineWidth: Circle.ctx!.lineWidth
        };

        const { addDrawing, user } = useCanvasStore.getState();
        addDrawing({ ...figure, type: 'circle' });

        Circle.socket.emit('draw', {
            method: 'draw',
            id: Circle.sessionId,
            figure,
            username: user
        });

        Circle.arrX = [];
        Circle.arrY = [];
    }

    static mouseDownHandler(event: MouseEvent) {
        Circle.mouseDown = true;
        const canvasData = Circle.canvas.toDataURL();
        Circle.ctx!.beginPath();
        Circle.arrX[0] = event.pageX - (event.target as HTMLElement).offsetLeft;
        Circle.arrY[0] = event.pageY - (event.target as HTMLElement).offsetTop;
        Circle.saved = canvasData;
    }

    static mouseMoveHandler(event: MouseEvent) {
        if (Circle.mouseDown) {
            Circle.arrX.push(event.pageX - (event.target as HTMLElement).offsetLeft);
            Circle.arrY.push(event.pageY - (event.target as HTMLElement).offsetTop);
            Circle.draw(
                Circle.arrX[0],
                Circle.arrY[0],

                (((Circle.arrX.at(-1) as number) - Circle.arrX[0]) ** 2 +
                    ((Circle.arrY.at(-1) as number) - Circle.arrY[0]) ** 2) **
                    0.5
            );
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
