import { create } from 'zustand'
import ITool from '../types/tool.inteface'

interface ToolState {
	tool: string | ITool | null
	setTool: (tool: string | ITool) => void
}

export const useToolStore = create<ToolState>(set => ({
	tool: null,
	setTool: tool => set({ tool: tool }),
}))

export default useToolStore
