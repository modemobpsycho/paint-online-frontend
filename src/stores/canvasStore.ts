import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import IBoard from '../types/board.interface';
import axios from 'axios';
import { API_URL } from '../helpers/constants';
import IFigure from '../types/figure.interface';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import canvasMath from '../helpers/canvasMath';
import Line from '../tools/Line';
import Tool from '../tools/Tool';
import useToolStore from './toolStore';

interface CanvasState {
    canvas: HTMLCanvasElement | null;
    setCanvas: (canvas: HTMLCanvasElement) => void;
    user: string;
    currentBoardUsers: string[];
    setUsername: (username: string) => void;
    setUser: () => void;
    setCurrentBoardUsers: (user: string) => void;
    deleteCurrentBoardUsers: (userName: string) => void;
    board: IBoard | null;
    boards: IBoard[];
    boardNameAdd: string;
    getBoard: () => void;
    deleteBoard: (id: number) => void;
    setBoards: () => void;
    addBoard: () => void;
    setBoardNameAdd: (board: string) => void;
    drawings: IFigure[];
    tempDrawings: IFigure[];
    getDrawings: (boardId: number) => void;
    setDrawings: (drawings: IFigure[]) => void;
    addDrawing: (drawing: IFigure) => void;
    deleteAllDrawings: () => void;
    setTempDrawings: (drawings: IFigure[]) => void;
    isUsernameModal: boolean;
    isBoardModal: boolean;
    setIsUsernameModal: (isUsernameModal: boolean) => void;
    setIsBoardModal: (isBoardModal: boolean) => void;
    socket: Socket;
    sessionId: string;
    setSocket: (socket: Socket) => void;
    setSessionId: (sessionId: string) => void;
    undo: () => void;
    redo: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    canvas: null,
    setCanvas: (canvas) => set({ canvas: canvas }),
    user: localStorage.getItem('username') || '',
    currentBoardUsers: [],
    setUsername: (username) => set({ user: username }),
    setUser: async () => {
        try {
            const { data } = await axios.post<{ id: number }>(API_URL + '/user', {
                username: get().user
            });
            localStorage.setItem('username', get().user);
            localStorage.setItem('id', String(data.id));
        } catch (error) {
            console.log(error);
        }
    },
    setCurrentBoardUsers: (user: string) => {
        if (!get().currentBoardUsers.includes(user)) {
            set((state) => ({ currentBoardUsers: [...state.currentBoardUsers, user] }));
        }
    },
    deleteCurrentBoardUsers: (userName) => {
        set({ currentBoardUsers: get().currentBoardUsers.filter((user) => user !== userName) });
    },
    boardNameAdd: '',
    board: null,
    setBoardNameAdd: (board) => set({ boardNameAdd: board }),
    getBoard: async () => {
        try {
            const response = await axios.get(API_URL + '/board/' + get().sessionId);
            set({ board: response.data });
            get().setTempDrawings([]);
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
        } catch (error) {
            console.error('Error with adding board:', error);
        }
    },
    drawings: [],
    setDrawings: (drawings) => {
        set({ drawings: drawings });
    },
    getDrawings: async (boardId) => {
        try {
            if (get().user) {
                const response = await axios.get(API_URL + '/board/' + boardId + '/drawings/');
                const data = await response.data;
                set({ drawings: data });

                const { setOptions } = useToolStore.getState();
                const context = get().canvas!.getContext('2d');
                context!.clearRect(0, 0, get().canvas!.width, get().canvas!.height);
                get().drawings.forEach((figure: IFigure) => {
                    switch (figure.type) {
                        case 'brush':
                            Brush.staticDraw(figure.posX, figure.posY, figure.strokeColor, figure.lineWidth);
                            setOptions();
                            break;
                        case 'rect':
                            Rect.staticDraw(
                                figure.posX[0],
                                figure.posY[0],
                                figure.posX.slice(-1)[0] - figure.posX[0],
                                figure.posY.slice(-1)[0] - figure.posY[0],
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
                        case 'finish':
                            Tool.ctx!.beginPath();
                            setOptions();
                            break;
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    addDrawing: async (drawing: IFigure) => {
        try {
            const response = await axios.post(API_URL + '/board/' + get().board?.id + '/drawing/', {
                type: drawing.type,
                lineWidth: drawing.lineWidth,
                strokeColor: drawing.strokeColor,
                fillColor: drawing.fillColor,
                posX: drawing.posX,
                posY: drawing.posY,
                username: get().user
            });
            get()
                .boards.find((board) => board.id === get().sessionId)
                ?.drawings.push(response.data);
        } catch (error) {
            console.log(error);
        }

        set({ drawings: [...get().drawings, drawing] });
    },
    deleteAllDrawings: () => {
        try {
            axios.delete(API_URL + '/drawing/' + get().user);
            set({ drawings: [] });
        } catch (error) {
            console.log(error);
        }
    },
    tempDrawings: [],
    setTempDrawings: (drawings) => set({ tempDrawings: drawings }),
    socket: io('https://paint-online-backend-0xmk.onrender.com'),
    setSocket: (socket) => set({ socket: socket }),
    sessionId: '',
    setSessionId: (sessionId) => set({ sessionId: sessionId }),
    isUsernameModal: false,
    setIsUsernameModal: (isUsernameModal) => set({ isUsernameModal }),
    isBoardModal: false,
    setIsBoardModal: (isBoardModal) => set({ isBoardModal }),
    undo: async () => {
        try {
            if (!get().drawings.length) return;

            const response = await axios.delete(API_URL + '/board/deletedraw/' + get().board?.id + '/' + get().user);
            const deletedDrawing = response.data;

            get().setTempDrawings([...get().tempDrawings, deletedDrawing]);
            get().getDrawings(Number(get().sessionId));

            get().socket.emit('cancelDraw', {
                method: 'cancelDraw',
                id: get().sessionId,
                figure: get().drawings.slice(-1)[0],
                username: get().user
            });
        } catch (error) {
            console.log(error);
        }
    },
    redo: async () => {
        try {
            if (!get().tempDrawings.length) return;
            const response = await axios.post(
                API_URL + '/board/postdraw/' + get().board?.id + '/' + get().user,
                get().tempDrawings[get().tempDrawings.length - 1]
            );

            const addedDrawing = response.data;

            get().setTempDrawings([...get().tempDrawings.slice(0, -1)]);
            get().setDrawings([...get().drawings, addedDrawing]);
            get().getDrawings(Number(get().sessionId));

            get().socket.emit('draw', {
                method: 'draw',
                id: get().sessionId,
                figure: addedDrawing
            });
        } catch (error) {
            console.log(error);
        }
    }
}));

export default useCanvasStore;
