import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography
} from '@mui/material';

export default function Home() {
    const [message, setMessage] = useState('You are not authenticaed');

    useEffect(() => {
        ( async () => {
            try {
                const { data: user } = await axios.get('http://localhost:3000/users/@me' , { withCredentials: true });
                setMessage(`Hi ${user.first_name} ${user.last_name}`);
            } catch (error) {
                setMessage('You are not authenticaed');
            }
        })();
    }, []);

    return (
        <Container>
            <Typography variant="h2" component="h3">Home</Typography>
            <Typography component="p">{message}</Typography>
        </Container>
    )
}
