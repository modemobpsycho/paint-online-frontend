export default interface IFigure {
    type: string;
    fillColor?: string | undefined;
    strokeColor: string;
    posX: number[];
    posY: number[];
    lineWidth: number;
}
