import useCanvasStore from '../stores/canvasStore';
import useToolStore from '../stores/toolStore';
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import Rect from '../tools/Rect';
import Tool from '../tools/Tool';
import { IFigure } from '../types/figure.interface';

export const useDrawHandler = () => {
    const { setOptions } = useToolStore((state) => state);
    const { addDrawing } = useCanvasStore((state) => state);

    return (msg: { figure: IFigure }) => {
        const figure = msg.figure;

        switch (figure.type) {
            case 'brush':
                Brush.staticDraw(figure.posX, figure.posY, figure.strokeColor, figure.lineWidth);
                console.log(figure);
                addDrawing(figure);
                break;
            case 'rect':
                Rect.staticDraw(
                    figure.posX,
                    figure.posY,
                    figure.width,
                    figure.height,
                    figure.fillColor,
                    figure.strokeColor,
                    figure.lineWidth
                );
                setOptions();
                break;
            case 'circle':
                Circle.staticDraw(
                    figure.posX,
                    figure.posY,
                    figure.width,
                    figure.strokeColor,
                    figure.fillColor,
                    figure.lineWidth
                );
                addDrawing(figure);
                setOptions();
                break;
            case 'line':
                Line.staticDraw(
                    figure.startX,
                    figure.startY,
                    figure.posX,
                    figure.posY,
                    figure.strokeColor,
                    figure.lineWidth
                );
                addDrawing(figure);
                setOptions();
                break;
            case 'eraser':
                Eraser.staticDrawEraser(figure.posX, figure.posY, figure.fillColor, figure.width);
                addDrawing(figure);
                break;
            case 'finish':
                Tool.ctx!.beginPath();
                setOptions();
                break;
        }
    };
};
