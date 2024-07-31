import { create } from 'zustand';
import ITool from '../types/tool.interface';
import Tool from '../tools/Tool';
import Eraser from '../tools/Eraser';

interface ToolState {
    tool: ITool | null;
    fillColor: string;
    strokeColor: string;
    lineWidth: number;
    setTool: (tool: ITool) => void;
    setFillColor: (color: string) => void;
    setStrokeColor: (color: string) => void;
    setLineWidth: (width: number) => void;
    setOptions: () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
    tool: null,
    fillColor: '#000000',
    strokeColor: '#000000',
    lineWidth: 1,
    setTool: (tool) => set({ tool: tool }),

    setFillColor: (color) => {
        Tool.setFillColor(color);
        set({ fillColor: color });
    },
    setStrokeColor: (color) => {
        if (!(get().tool instanceof Eraser)) {
            Tool.setStrokeColor(color);
        }
        set({ strokeColor: color });
    },
    setLineWidth: (width) => {
        Tool.setLineWidth(width);
        set({ lineWidth: width });
    },
    setOptions: () => {
        Tool.setFillColor(get().fillColor);
        Tool.setStrokeColor(get().strokeColor);
        Tool.setLineWidth(get().lineWidth);
    }
}));

export default useToolStore;

export const UsetStrokeColor = (color: string) => {
    useToolStore.getState().setStrokeColor(color);
};
