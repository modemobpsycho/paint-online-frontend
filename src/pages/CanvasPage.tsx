import Canvas from '../components/Canvas/Canvas';
import SettingBar from '../components/SettingBar/SettingBar';
import Toolbar from '../components/Toolbar/Toolbar';

function CanvasPage() {
    return (
        <>
            <Toolbar />
            <SettingBar />
            <Canvas />
        </>
    );
}

export default CanvasPage;
