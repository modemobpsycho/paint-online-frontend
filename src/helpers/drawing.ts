import useToolStore from '../stores/toolStore';
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import Rect from '../tools/Rect';
import Tool from '../tools/Tool';
import IFigure from '../types/figure.interface';
import canvasMath from './canvasMath';

export const useDrawHandler = () => {
    const { setOptions } = useToolStore((state) => state);

    return (msg: { figure: IFigure }) => {
        const figure = msg.figure;

        switch (figure.type) {
            case 'brush':
                Brush.staticDraw(figure.posX, figure.posY, figure.strokeColor, figure.lineWidth);
                break;
            case 'rect':
                Rect.staticDraw(
                    figure.posX[0],
                    figure.posY[0],
                    (figure.posX.at(-1) as number) - figure.posX[0],
                    (figure.posY.at(-1) as number) - figure.posY[0],
                    figure.fillColor || figure.strokeColor,
                    figure.strokeColor,
                    figure.lineWidth
                );
                setOptions();
                break;
            case 'circle':
                Circle.staticDraw(
                    figure.posX[0],
                    figure.posY[0],
                    canvasMath.getRadius(figure.posX[0], figure.posY[0], figure.posX[1], figure.posY[1]),
                    figure.strokeColor,
                    figure.fillColor || figure.strokeColor,
                    figure.lineWidth
                );
                setOptions();
                break;
            case 'line':
                Line.staticDraw(
                    figure.posX[0],
                    figure.posY[0],
                    figure.posX[1],
                    figure.posY[1],
                    figure.strokeColor,
                    figure.lineWidth
                );
                setOptions();
                break;
            case 'eraser':
                Eraser.staticDrawEraser(figure.posX.at(-1) as number, figure.posY.at(-1) as number, figure.lineWidth);
                break;
            case 'finish':
                Tool.ctx!.beginPath();
                setOptions();
                break;
        }
    };
};
