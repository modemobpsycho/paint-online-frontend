import { create } from 'zustand';
import ITool from '../types/tool.interface';
import Tool from '../tools/Tool';
import Eraser from '../tools/Eraser';

interface ToolState {
    tool: ITool | null;
    fillColor: string;
    strokeColor: string;
    lineWidth: number;
    tempStrokeColor: string;
    setTool: (tool: ITool) => void;
    setFillColor: (color: string) => void;
    setStrokeColor: (color: string) => void;
    setLineWidth: (width: number) => void;
    setOptions: () => void;
    setDefaultOptions: () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
    tool: null,
    fillColor: '#000000',
    strokeColor: '#000000',
    tempStrokeColor: '#000000',
    lineWidth: 1,

    setTool: (tool) => {
        if (tool instanceof Eraser) {
            set({ tempStrokeColor: get().strokeColor });
            console.log('--------------------' + get().tempStrokeColor, get().strokeColor);
        } else {
            console.log('+++++++++++' + get().tempStrokeColor, get().strokeColor);
            get().setStrokeColor(get().tempStrokeColor);
        }
        set({ tool: tool });
    },

    setFillColor: (color) => {
        Tool.setFillColor(color);
        set({ fillColor: color });
    },

    setStrokeColor: (color) => {
        if (!(get().tool instanceof Eraser)) {
            Tool.setStrokeColor(color);
            console.log(1);
        }
        console.log(2);
        set({ strokeColor: color, tempStrokeColor: color });
    },

    setLineWidth: (width) => {
        Tool.setLineWidth(width);
        set({ lineWidth: width });
    },

    setOptions: () => {
        Tool.setFillColor(get().fillColor);
        if (get().tool instanceof Eraser) {
            Tool.setStrokeColor('#FFFFFF');
        } else {
            Tool.setStrokeColor(get().strokeColor);
        }
        Tool.setLineWidth(get().lineWidth);
    },

    setDefaultOptions: () => {
        get().setFillColor('#000000');
        get().setStrokeColor('#000000');
        get().setLineWidth(1);
    }
}));

export default useToolStore;

export const toolStrokeColor = (color: string) => {
    // useToolStore.getState().setStrokeColor(color);
    Tool.setStrokeColor(color);
};
