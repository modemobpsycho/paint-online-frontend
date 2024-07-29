import { create } from 'zustand';
import ITool from '../types/tool.inteface';
import Tool from '../tools/Tool';

interface ToolState {
    tool: ITool | null;
    fillColor: string;
    strokeColor: string;
    setTool: (tool: ITool) => void;
    setFillColor: (color: string) => void;
    setStrokeColor: (color: string) => void;
    setLineWidth: (width: number) => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
    tool: null,
    fillColor: '#000000',
    strokeColor: '#000000',
    setTool: (tool) => set({ tool: tool }),

    setFillColor: (color) => (get().tool as Tool).setFillColor(color),
    setStrokeColor: (color) => (get().tool as Tool).setStrokeColor(color),
    setLineWidth: (width) => (get().tool as Tool).setLineWidth(width)
}));

export default useToolStore;
