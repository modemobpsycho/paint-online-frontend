import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import IBoard from '../types/board.interface';
import axios from 'axios';
import { API_URL } from '../helpers/constants';
import { IDrawing } from '../types/drawing.interface';

interface CanvasState {
    canvas: HTMLCanvasElement | null;
    undoList: string[];
    redoList: string[];
    boardNameAdd: string;
    board: IBoard | null;
    isUsernameModal: boolean;
    isBoardModal: boolean;
    user: string;
    currentBoardUsers: string[];
    socket: Socket;
    sessionId: string;
    boards: IBoard[];
    drawings: IDrawing[];
    setDrawings: () => void;
    addDrawing: (drawing: IDrawing) => void;
    deleteDrawing: (id: number) => void;
    getDrawing: (id: number) => void;
    deleteAllDrawings: () => void;

    undo: () => void;
    redo: () => void;
    setBoardNameAdd: (board: string) => void;
    setIsUsernameModal: (isUsernameModal: boolean) => void;
    setIsBoardModal: (isBoardModal: boolean) => void;
    setUser: (username: string) => void;
    setCurrentBoardUsers: (user: string) => void;
    deleteCurrentBoardUsers: (userName: string) => void;
    leaveBoard: () => void;
    setSocket: (socket: Socket) => void;
    setSessionId: (sessionId: string) => void;
    setCanvas: (canvas: HTMLCanvasElement) => void;
    pushToUndo: (data: string) => void;
    pushToRedo: (data: string) => void;
    getBoard: () => void;
    deleteBoard: (id: number) => void;
    setBoards: () => void;
    addBoard: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    canvas: null,
    undoList: [],
    redoList: [],
    setCanvas: (canvas) => set({ canvas: canvas }),
    pushToUndo(data: string) {
        get().undoList.push(data);
    },
    pushToRedo(data: string) {
        get().redoList.push(data);
    },
    undo() {
        const ctx = get().canvas!.getContext('2d');
        if (get().undoList.length > 0) {
            const dataUrl = get().undoList.pop() as string;
            get().redoList.push(dataUrl);
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx!.clearRect(0, 0, get().canvas!.width, get().canvas!.height);
                ctx!.drawImage(img, 0, 0, get().canvas!.width, get().canvas!.height);
            };
        } else {
            ctx!.clearRect(0, 0, get().canvas!.width, get().canvas!.height);
        }
    },
    redo() {
        const ctx = get().canvas?.getContext('2d');
        if (get().redoList.length > 0) {
            const dataUrl = get().redoList.pop() as string;
            get().redoList.push(get().canvas?.toDataURL() as string);
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx!.clearRect(0, 0, get().canvas!.width, get().canvas!.height);
                ctx!.drawImage(img, 0, 0, get().canvas!.width, get().canvas!.height);
            };
        }
    },
    isUsernameModal: false,
    setIsUsernameModal: (isUsernameModal) => set({ isUsernameModal }),
    isBoardModal: false,
    setIsBoardModal: (isBoardModal) => set({ isBoardModal }),
    user: localStorage.getItem('username') || '',
    currentBoardUsers: [],
    setCurrentBoardUsers: (user: string) => {
        if (get().currentBoardUsers.includes(user) == false) {
            set((state) => ({ currentBoardUsers: [...state.currentBoardUsers, user] }));
        }
    },
    deleteCurrentBoardUsers: (userName) => {
        set({ currentBoardUsers: get().currentBoardUsers.filter((user) => user !== userName) });
    },
    leaveBoard: () => {
        set({ currentBoardUsers: [] });
    },
    drawings: [],
    setDrawings: async () => {
        try {
            if (get().user) {
                const response = await axios.get(API_URL + '/drawing/' + get().user);
                const data = await response.data;
                set({ drawings: data });
            }
        } catch (error) {
            console.log(error);
        }
    },
    addDrawing: async (drawing: IDrawing) => {
        try {
            const response = await axios.post(API_URL + '/drawing' + get().board, {
                id: drawing.id,
                type: drawing.type,
                lineWidth: drawing.lineWidth,
                strokeColor: drawing.strokeColor,
                fillColor: drawing.fillColor,
                posX: drawing.posX,
                posY: drawing.posY,
                username: drawing.username
            });
            get()
                .boards.find((board) => board.id === get().board?.id)
                ?.drawings.push(response.data);
        } catch (error) {
            console.log(error);
        }

        set((state) => ({ drawings: [...state.drawings, drawing] }));
    },
    deleteDrawing: (id) => {
        set((state) => ({ drawings: state.drawings.filter((drawing) => drawing.id !== id) }));
    },
    getDrawing: (id) => {
        set((state) => ({ drawings: state.drawings.filter((drawing) => drawing.id === id) }));
    },
    deleteAllDrawings: () => {
        try {
            axios.delete(API_URL + '/drawing/' + get().user);
            set({ drawings: [] });
        } catch (error) {
            console.log(error);
        }
    },
    setUser: (username) => {
        set({ user: username });
        localStorage.setItem('username', username);
    },
    socket: io('http://localhost:3000'),
    setSocket: (socket) => set({ socket: socket }),
    sessionId: '',
    setSessionId: (sessionId) => set({ sessionId: sessionId }),
    boardNameAdd: '',
    board: null,
    setBoardNameAdd: (board) => set({ boardNameAdd: board }),
    getBoard: async () => {
        try {
            const response = await axios.get(API_URL + '/board/' + get().sessionId);
            set({ board: response.data });
        } catch (error) {
            console.error('Error with getting board:', error);
        }
    },
    deleteBoard: async (id) => {
        try {
            const response = await axios.delete(API_URL + '/board/' + id);
            set({ boards: get().boards.filter((board) => board.id !== response.data.id) });
        } catch (error) {
            console.error('Error with deleting board:', error);
        }
    },
    boards: [],
    setBoards: async () => {
        try {
            const response = await axios.get(API_URL + '/boards');
            const boardsData = response.data;
            set({ boards: boardsData });
        } catch (error) {
            console.error('Error with getting boards:', error);
        }
    },
    addBoard: async () => {
        try {
            const response = await axios.post(API_URL + '/board', {
                name: get().boardNameAdd,
                creator: get().user
            });

            set({ boards: [...get().boards, response.data] });
            console.log('Новый борд успешно создан:', response.data);
        } catch (error) {
            console.error('Ошибка при создании нового борда:', error);
        }
    }
}));

export default useCanvasStore;
