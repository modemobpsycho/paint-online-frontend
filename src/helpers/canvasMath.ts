const canvasMath = {
    getRadius(x1: number, y1: number, x2: number, y2: number) {
        const x = x1 - x2;
        const y = y1 - y2;
        return Math.sqrt(x * x + y * y);
    },

    getWidth(x1: number, x2: number) {
        const width: number = x1 - x2;
        return width;
    },

    getHeight(y1: number, y2: number) {
        const height: number = y1 - y2;
        return height;
    }
};

export default canvasMath;
