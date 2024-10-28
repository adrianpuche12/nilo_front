import { Typography } from '@mui/material';

function Title({ text }) {
    return (
        <Typography variant="h5" sx={{ textAlign: 'center', margin: 2 }}>
            <h3>{text}</h3>
        </Typography>
    );
}

export default Title;