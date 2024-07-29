import { Box, Button, Typography } from '@mui/material';
import '../styles/home.scss';

function Home() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography
                variant="h2"
                sx={{
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'initial'
                }}
            >
                PAINT ONLINE
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    marginTop: '-30px',
                    color: 'white',
                    fontFamily: 'initial'
                }}
            >
                by Vadim Taratuta
            </Typography>
            <Box className="content">
                <Button
                    variant="contained"
                    color="inherit"
                    href="/boards"
                    sx={{
                        display: 'block',
                        margin: '30px auto',
                        borderRadius: '10px'
                    }}
                >
                    Go to boards
                </Button>
            </Box>
        </Box>
    );
}

export default Home;
