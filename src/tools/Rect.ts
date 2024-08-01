import { Socket } from 'socket.io-client';
import Tool from './Tool';
import useCanvasStore from '../stores/canvasStore';

export default class Rect extends Tool {
    static arrX: number[] = [];
    static arrY: number[] = [];

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
        if (!Rect.mouseDown) {
            return;
        }
        super.mouseUpHandler();
        const figure = {
            type: 'rect',
            posX: Rect.arrX as number[],
            posY: Rect.arrY as number[],
            width: (Rect.arrX.at(-1) as number) - Rect.arrX[0],
            height: (Rect.arrY.at(-1) as number) - Rect.arrY[0],
            fillColor: Rect.ctx!.fillStyle as string,
            strokeColor: Rect.ctx!.strokeStyle as string,
            lineWidth: Rect.ctx!.lineWidth as number
        };

        const { addDrawing } = useCanvasStore.getState();
        addDrawing({ ...figure, type: 'rect' });

        Rect.socket.emit('draw', {
            method: 'draw',
            id: Rect.sessionId,
            figure
        });
        Rect.arrX = [];
        Rect.arrY = [];
    }

    static mouseDownHandler(event: MouseEvent) {
        Rect.mouseDown = true;
        Rect.ctx!.beginPath();
        Rect.arrX[0] = event.pageX - (event.target as HTMLElement).offsetLeft;
        Rect.arrY[0] = event.pageY - (event.target as HTMLElement).offsetTop;
        Rect.saved = Rect.canvas.toDataURL();
    }

    static mouseMoveHandler(event: MouseEvent) {
        if (Rect.mouseDown) {
            Rect.arrX.push(event.pageX - (event.target as HTMLElement).offsetLeft);
            Rect.arrY.push(event.pageY - (event.target as HTMLElement).offsetTop);

            Rect.draw(
                Rect.arrX[0],
                Rect.arrY[0],
                (Rect.arrX.at(-1) as number) - Rect.arrX[0],
                (Rect.arrY.at(-1) as number) - Rect.arrY[0]
            );
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
