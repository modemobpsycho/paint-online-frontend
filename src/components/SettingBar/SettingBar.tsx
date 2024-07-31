import { Box, Input, Typography } from '@mui/material';
import useCanvasStore from '../../stores/canvasStore';
import useToolStore from '../../stores/toolStore';
import '../../styles/header.scss';

export default function SettingBar() {
    const { setLineWidth, setStrokeColor } = useToolStore((state) => state);
    const { board, currentBoardUsers } = useCanvasStore((state) => state);

    return (
        <Box className="setting-bar">
            <Typography sx={{ marginLeft: '10px', fontSize: '18px' }}>Line width:</Typography>
            <Input
                sx={{ margin: '0 5px', width: '50px', textAlign: 'center', height: '20px', fontSize: '18px' }}
                id="line-width"
                type="number"
                defaultValue={1}
                inputProps={{ min: 0, max: 50 }}
                onChange={(e) => setLineWidth(Number(e.target.value))}
            />
            <Typography sx={{ marginLeft: '10px', fontSize: '18px' }}>Stroke color:</Typography>
            <Input
                style={{ margin: '0 10px', width: '25px', height: '20px' }}
                id="stroke-color"
                type="color"
                onChange={(e) => setStrokeColor(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, marginRight: '20px' }}>
                <Typography sx={{ marginLeft: '10px', fontSize: '18px' }}>{'Board name: ' + board?.name}</Typography>
                <Typography sx={{ marginLeft: '10px', fontSize: '18px' }}>
                    {'Users:' + currentBoardUsers.map((user) => ' ' + user)}
                </Typography>
            </Box>
        </Box>
    );
}
