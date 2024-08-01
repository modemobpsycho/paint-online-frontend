/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import Canvas from '../components/Canvas/Canvas';
import SettingBar from '../components/SettingBar/SettingBar';
import Toolbar from '../components/Toolbar/Toolbar';
import useCanvasStore from '../stores/canvasStore';
import useToolStore from '../stores/toolStore';
import { useParams } from 'react-router-dom';

function CanvasPage() {
    const { getDrawings, setDrawings } = useCanvasStore((state) => state);
    const { setDefaultOptions } = useToolStore((state) => state);
    const params = useParams();

    useEffect(() => {
        getDrawings(Number(params.id!));

        return () => {
            setDrawings([]);
            setDefaultOptions();
        };
    }, []);

    return (
        <>
            <Toolbar />
            <SettingBar />
            <Canvas />
        </>
    );
}

export default CanvasPage;
