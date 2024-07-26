import { Socket } from 'socket.io-client'
import { create } from 'zustand'
import IBoard from '../types/board.interface'
import axios from 'axios'
import { API_URL } from '../helpers/constants'

interface CanvasState {
	canvas: HTMLCanvasElement | null
	undoList: string[]
	redoList: string[]
	setCanvas: (canvas: HTMLCanvasElement) => void
	pushToUndo: (data: string) => void
	pushToRedo: (data: string) => void
	undo: () => void
	redo: () => void
	modal: boolean
	setModal: (showModal: boolean) => void
	user: string
	setUser: (username: string) => void
	socket: Socket | null
	setSocket: (socket: Socket) => void
	sessionId: string
	setSessionId: (sessionId: string) => void
	boards: IBoard[]
	setBoards: () => void
	addBoard: (boardName: string) => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
	canvas: null,
	undoList: [],
	redoList: [],
	setCanvas: canvas => set({ canvas: canvas }),
	pushToUndo(data: string) {
		get().undoList.push(data)
	},
	pushToRedo(data: string) {
		get().redoList.push(data)
	},
	undo() {
		const ctx = get().canvas!.getContext('2d')
		if (get().undoList.length > 0) {
			const dataUrl = get().undoList.pop() as string
			get().redoList.push(dataUrl)
			const img = new Image()
			img.src = dataUrl
			img.onload = () => {
				ctx!.clearRect(0, 0, get().canvas!.width, get().canvas!.height)
				ctx!.drawImage(img, 0, 0, get().canvas!.width, get().canvas!.height)
			}
		} else {
			ctx!.clearRect(0, 0, get().canvas!.width, get().canvas!.height)
		}
	},
	redo() {
		const ctx = get().canvas?.getContext('2d')
		if (get().redoList.length > 0) {
			const dataUrl = get().redoList.pop() as string
			get().redoList.push(get().canvas?.toDataURL() as string)
			const img = new Image()
			img.src = dataUrl
			img.onload = () => {
				ctx!.clearRect(0, 0, get().canvas!.width, get().canvas!.height)
				ctx!.drawImage(img, 0, 0, get().canvas!.width, get().canvas!.height)
			}
		}
	},
	modal: true,
	setModal: modal => set({ modal: modal }),
	user: '',
	setUser: username => set({ user: username }),
	socket: null,
	setSocket: socket => set({ socket: socket }),
	sessionId: '',
	setSessionId: sessionId => set({ sessionId: sessionId }),
	boards: [],
	setBoards: async () => {
		try {
			const response = await axios.get(API_URL + '/boards')
			const boardsData = response.data
			set({ boards: boardsData })
		} catch (error) {
			console.error('Error with getting boards:', error)
		}
	},
	addBoard: boardName => set({ boards: boardName['boards'] }),
}))

export default useCanvasStore
