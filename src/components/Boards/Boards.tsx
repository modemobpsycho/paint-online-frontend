import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import useCanvasStore from '../../stores/canvasStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Boards() {
    const { user, boards, deleteBoard, setBoards } = useCanvasStore((state) => state);

    const navigate = useNavigate();

    useEffect(() => {
        setBoards();
    }, []);

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <Box sx={{ padding: '20px', width: '100%' }}>
                <Box
                    sx={{
                        marginTop: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}
                >
                    {boards.map((board, index) => (
                        <Card
                            key={index}
                            sx={{
                                width: 300,
                                margin: '10px',
                                height: 200,
                                borderRadius: '10px',
                                boxShadow: '4px 4px 5px gray'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">{board.name}</Typography>
                                    {board.creator === user && (
                                        <Button onClick={() => deleteBoard(Number(board.id))}>
                                            <DeleteIcon sx={{ color: 'black', fontSize: '20px' }} />
                                        </Button>
                                    )}
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    Creator: {board.creator}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: 'auto'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        sx={{
                                            width: '80%',
                                            borderRadius: '10px',
                                            marginTop: '8vh'
                                        }}
                                        onClick={() => navigate('/' + board.id)}
                                    >
                                        Join Room
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </div>
    );
}

export default Boards;
