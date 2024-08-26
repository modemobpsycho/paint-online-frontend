import { Box, Button, Typography, Toolbar } from '@mui/material';
import useCanvasStore from '../stores/canvasStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Modal from '../shared/Modal/Modal';
import Boards from '../components/Boards/Boards';

function BoardsPage() {
    const {
        user,
        isUsernameModal,
        setIsUsernameModal,
        setUser,
        setUsername,
        isBoardModal,
        setIsBoardModal,
        boardNameAdd,
        setBoardNameAdd,
        addBoard
    } = useCanvasStore((state) => state);

    const navigate = useNavigate();

    useEffect(() => {
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
                onChange={(e) => setUsername(e.target.value)}
                onClick={() => {
                    setIsUsernameModal(false);
                    setUser();
                }}
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
                    src="/assets/logo.png"
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
            <Boards />
        </Box>
    );
}

export default BoardsPage;
