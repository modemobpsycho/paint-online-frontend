import { Box, Button, Typography, Card, CardContent, Toolbar } from '@mui/material';
import useCanvasStore from '../stores/canvasStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Modal from '../shared/Modal/Modal';

function BoardsPage() {
    const {
        user,
        setBoards,
        boards,
        isUsernameModal,
        setIsUsernameModal,
        setUser,
        isBoardModal,
        setIsBoardModal,
        boardNameAdd,
        setBoardNameAdd,
        addBoard,
        deleteBoard
    } = useCanvasStore((state) => state);

    const navigate = useNavigate();

    useEffect(() => {
        setBoards();

        if (!user) {
            setIsUsernameModal(true);
        }
    }, []);

    return (
        <Box>
            <Modal
                isCloseButton={false}
                props={{
                    show: isUsernameModal,
                    onHide: () => {},
                    title: 'Choose your username',
                    message: 'Enter your pretty name here!',
                    value: user
                }}
                onChange={(e) => setUser(e.target.value)}
                onClick={() => setIsUsernameModal(false)}
            />
            <Modal
                isCloseButton={true}
                props={{
                    show: isBoardModal,
                    onHide: () => setIsBoardModal(false),
                    title: 'Create new board',
                    message: 'Enter board name',
                    value: boardNameAdd
                }}
                onChange={(e) => setBoardNameAdd(e.target.value)}
                onClick={() => {
                    addBoard();
                    setIsBoardModal(false);
                }}
            />
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <img
                    src="assets/logo.png"
                    alt="logo"
                    style={{
                        height: '60px',
                        width: '60px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent'
                    }}
                    onClick={() => {
                        navigate('/');
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user && (
                        <Typography variant="h6" sx={{ marginRight: '10px', color: 'white' }}>
                            Hi, {user}
                        </Typography>
                    )}
                    <Button color="inherit" variant="contained" onClick={() => setIsUsernameModal(true)}>
                        Set Username
                    </Button>
                </div>
            </Toolbar>
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
                        borderRadius: '10px'
                    }}
                    onClick={() => setIsBoardModal(true)}
                >
                    Create new board
                </Button>
            </Box>

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
        </Box>
    );
}

export default BoardsPage;
