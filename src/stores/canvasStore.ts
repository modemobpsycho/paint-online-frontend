import { create } from 'zustand'

interface CanvasState {
	canvas: HTMLCanvasElement | null
	setCanvas: (canvas: HTMLCanvasElement) => void
}

export const useCanvasStore = create<CanvasState>(set => ({
	canvas: null,
	setCanvas: canvas => set({ canvas: canvas }),
}))

export default useCanvasStore
