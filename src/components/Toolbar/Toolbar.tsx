import '../../styles/header.scss';
import BrushIcon from '@mui/icons-material/Brush';
import BoxIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import LineIcon from '@mui/icons-material/ShowChart';
import UndoIcon from '@mui/icons-material/UndoOutlined';
import HomeIcon from '@mui/icons-material/Home';
import RedoIcon from '@mui/icons-material/RedoOutlined';
import SaveIcon from '@mui/icons-material/SaveAltOutlined';
import useToolStore from '../../stores/toolStore';
import useCanvasStore from '../../stores/canvasStore';
import Brush from '../../tools/Brush';
import Rect from '../../tools/Rect';
import Circle from '../../tools/Circle';
import Eraser from '../../tools/Eraser';
import Line from '../../tools/Line';
import { useNavigate } from 'react-router-dom';
import ITool from '../../types/tool.interface';
import { useState } from 'react';

export default function Toolbar() {
    const { setTool, setFillColor } = useToolStore((state) => state);
    const { canvas, redo, undo, socket, sessionId } = useCanvasStore((state) => state);
    const [selectedTool, setSelectedTool] = useState('Brush');
    const navigate = useNavigate();

    const download = () => {
        const dataUrl = canvas!.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = sessionId + '.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="toolbar">
            <button className="toolbar__button" onClick={() => navigate('/boards')}>
                <HomeIcon />
            </button>
            <button
                className={`toolbar__button ${selectedTool === 'Brush' ? 'toolbar__button--active' : ''} `}
                onClick={() => {
                    setTool(new Brush(canvas!, socket!, sessionId) as ITool);
                    setSelectedTool('Brush');
                }}
            >
                <BrushIcon />
            </button>
            <button
                className={`toolbar__button ${selectedTool === 'Rect' ? 'toolbar__button--active' : ''} `}
                onClick={() => {
                    setTool(new Rect(canvas!, socket!, sessionId) as ITool);
                    setSelectedTool('Rect');
                }}
            >
                <BoxIcon />
            </button>
            <button
                className={`toolbar__button ${selectedTool === 'Circle' ? 'toolbar__button--active' : ''} `}
                onClick={() => {
                    setTool(new Circle(canvas!, socket!, sessionId) as ITool);
                    setSelectedTool('Circle');
                }}
            >
                <CircleIcon />
            </button>
            <button
                className={`toolbar__button ${selectedTool === 'Eraser' ? 'toolbar__button--active' : ''} `}
                onClick={() => {
                    setTool(new Eraser(canvas!, socket!, sessionId) as ITool);
                    setSelectedTool('Eraser');
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-eraser-fill fs-3"
                    viewBox="0 0 16 16"
                >
                    <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                </svg>
            </button>
            <button
                className={`toolbar__button ${selectedTool === 'Line' ? 'toolbar__button--active' : ''} `}
                onClick={() => {
                    setTool(new Line(canvas!, socket!, sessionId) as ITool);
                    setSelectedTool('Line');
                }}
            >
                <LineIcon />
            </button>

            <input
                style={{ width: '30px', height: '30px', marginLeft: '10px' }}
                type="color"
                onChange={(event) => setFillColor(event.target.value)}
            />

            <button className="toolbar__button" style={{ marginLeft: 'auto' }} onClick={undo}>
                <UndoIcon />
            </button>
            <button className="toolbar__button" onClick={redo}>
                <RedoIcon />
            </button>
            <button className="toolbar__button" style={{ marginRight: '10px' }} onClick={download}>
                <SaveIcon />
            </button>
        </div>
    );
}
