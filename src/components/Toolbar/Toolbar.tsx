import '../../styles/header.scss';
import BrushIcon from '@mui/icons-material/Brush';
import BoxIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
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

export default function Toolbar() {
    const { setTool, setFillColor } = useToolStore((state) => state);
    const { canvas, redo, undo, socket, sessionId } = useCanvasStore((state) => state);
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
                className="toolbar__button"
                onClick={() => {
                    setTool(new Brush(canvas!, socket!, sessionId) as ITool);
                }}
            >
                <BrushIcon />
            </button>
            <button
                className="toolbar__button"
                onClick={() => {
                    setTool(new Rect(canvas!, socket!, sessionId) as ITool);
                }}
            >
                <BoxIcon />
            </button>
            <button
                className="toolbar__button"
                onClick={() => setTool(new Circle(canvas!, socket!, sessionId) as ITool)}
            >
                <CircleIcon />
            </button>
            <button
                className="toolbar__button"
                onClick={() => setTool(new Eraser(canvas!, socket!, sessionId) as ITool)}
            >
                <EditIcon />
            </button>
            <button className="toolbar__button" onClick={() => setTool(new Line(canvas!, socket!, sessionId) as ITool)}>
                <LineIcon />
            </button>

            <input
                style={{ width: '30px', height: '30px', marginLeft: '10px' }}
                type="color"
                onChange={(event) => setFillColor(event.target.value)}
            />

            <button className="toolbar__button" style={{ marginLeft: 'auto' }} onClick={() => undo()}>
                <UndoIcon />
            </button>
            <button className="toolbar__button" onClick={() => redo()}>
                <RedoIcon />
            </button>
            <button className="toolbar__button" style={{ marginRight: '10px' }} onClick={() => download()}>
                <SaveIcon />
            </button>
        </div>
    );
}
