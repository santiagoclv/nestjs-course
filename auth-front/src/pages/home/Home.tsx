import { useEffect, useState } from 'react';
import {
    Container,
    Typography
} from '@mui/material';

export default function Home() {
    const [message, setMessage] = useState('You are not authenticaed');

    useEffect(() => {
        ( async () => {
            try {
                const response = await fetch('http://localhost:3000/users/@me' ,{
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const user = await response.json();
                    console.log(user)
                    setMessage(`Hi ${user.first_name} ${user.last_name}`);
                }
            } catch (error) {
                setMessage(`Something whent wrong!`);
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
