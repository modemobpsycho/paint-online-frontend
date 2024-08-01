import { Socket } from 'socket.io-client';
import Tool from './Tool';
import useCanvasStore from '../stores/canvasStore';

export default class Brush extends Tool {
    static arrX: number[] = [];
    static arrY: number[] = [];

    constructor(canvas: HTMLCanvasElement, socket: Socket, sessionId: string) {
        super(canvas, socket, sessionId);
        Brush.listen();
    }

    static listen() {
        Brush.canvas.onmouseup = this.mouseUpHandler.bind(this);
        Brush.canvas.onmouseleave = this.mouseUpHandler.bind(this);
        Brush.canvas.onmousedown = this.mouseDownHandler.bind(this);
        Brush.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    static mouseUpHandler() {
        if (!Brush.mouseDown) {
            return;
        }
        super.mouseUpHandler();
        const figure = {
            type: 'brush',
            posX: Brush.arrX as number[],
            posY: Brush.arrY as number[],
            strokeColor: Brush.ctx!.strokeStyle as string,
            lineWidth: Brush.ctx!.lineWidth as number,
            lineCap: Brush.ctx!.lineCap as string
        };
        Brush.socket.emit('draw', {
            method: 'draw',
            id: Brush.sessionId,
            figure,
            user: useCanvasStore.getState().user
        });
        const { addDrawing } = useCanvasStore.getState();
        addDrawing({ ...figure, type: 'brush' });

        Brush.arrX = [];
        Brush.arrY = [];
        Brush.socket.emit('draw', {
            method: 'draw',
            id: Brush.sessionId,
            figure: {
                type: 'finish'
            }
        });
    }

    static mouseDownHandler(event: MouseEvent) {
        Brush.mouseDown = true;
        Brush.ctx!.beginPath();
        Brush.ctx!.moveTo(
            event.pageX - (event.target as HTMLElement).offsetLeft,
            event.pageY - (event.target as HTMLElement).offsetTop
        );
    }

    static mouseMoveHandler(event: MouseEvent) {
        if (Brush.mouseDown) {
            Brush.arrX.push(event.pageX - (event.target as HTMLElement).offsetLeft);
            Brush.arrY.push(event.pageY - (event.target as HTMLElement).offsetTop);
            Brush.ctx!.lineTo(Brush.arrX[Brush.arrX.length - 1], Brush.arrY[Brush.arrY.length - 1]);
            Brush.ctx!.stroke();
        }
    }

    static staticDraw(x: number[], y: number[], color: string, lineWidth: number) {
        Brush.ctx!.lineWidth = lineWidth;
        Brush.ctx!.strokeStyle = color;

        Brush.ctx!.beginPath();
        Brush.ctx!.moveTo(x[0], y[0]);
        console.log('------' + x.length);
        x.forEach((x, i) => {
            Brush.ctx!.lineTo(x, y[i]);
            Brush.ctx!.stroke();
        });
    }
}
