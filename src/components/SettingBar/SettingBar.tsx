import { Box, Input, Typography } from '@mui/material';
import useCanvasStore from '../../stores/canvasStore';
import useToolStore from '../../stores/toolStore';
import '../../styles/header.scss';

export default function SettingBar() {
    const { setLineWidth, setStrokeColor } = useToolStore((state) => state);
    const { board, currentBoardUsers } = useCanvasStore((state) => state);

    return (
        <Box className="setting-bar">
            <Typography sx={{ marginLeft: '20px', fontSize: '18px', fontFamily: 'inherit' }}>Line width:</Typography>
            <Input
                sx={{
                    margin: '0 5px',
                    width: '50px',
                    height: '20px',
                    fontSize: '18px',
                    color: '#ffffff',
                    borderRadius: '5px'
                }}
                id="line-width"
                type="number"
                defaultValue={1}
                inputProps={{ min: 1, max: 50 }}
                onChange={(e) => setLineWidth(Number(e.target.value))}
            />
            <Typography sx={{ marginLeft: '10px', fontSize: '18px', fontFamily: 'inherit' }}>Stroke color:</Typography>
            <input
                style={{ margin: '0 10px', width: '25px', height: '25px' }}
                id="stroke-color"
                type="color"
                onChange={(e) => setStrokeColor(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, marginRight: '20px' }}>
                <Typography sx={{ marginLeft: '10px', fontSize: '18px', fontFamily: 'inherit' }}>
                    {'Board: ' + board?.name}
                </Typography>
                <Typography sx={{ marginLeft: '10px', fontSize: '18px', fontFamily: 'inherit' }}>
                    {'Users:' + currentBoardUsers.map((user) => ' ' + user)}
                </Typography>
            </Box>
        </Box>
    );
}
