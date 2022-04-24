import {
    Typography,
    Container
} from '@mui/material';
import { Outlet, Link } from "react-router-dom";
import styled from '@emotion/styled';

const Header = styled.header`
  padding: 32px;
  font-size: 24px;
  color: black;
  font-weight: bold;
  display: grid;
  grid-template-columns: 80% 10% 10%;
`
export default function Layout() {
    return (
        <>
            <Container>
                <Header>
                    <Link to="/"><Typography variant="h6">Auth App</Typography></Link>
                    <Link to="/singin"><Typography variant="h6">Sing in</Typography></Link> 
                    <Link to="/singup"><Typography variant="h6">Sing up</Typography></Link> 
                </Header>
            </Container>
            <Outlet />
        </>
    )
}
