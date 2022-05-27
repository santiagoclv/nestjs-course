import {
    Typography,
    Container
} from '@mui/material';
import { Outlet, Link } from "react-router-dom";
import styled from '@emotion/styled';
import { useGetMeQuery, useLogoutMutation } from '../../redux/services/auth/auth';

const Header = styled.header`
  padding: 32px;
  font-size: 24px;
  color: black;
  font-weight: bold;
  display: grid;
  grid-template-columns: 30% 20% 20% 20%;
`;

export default function Layout() {
    const { data: user } = useGetMeQuery();
    const [ logout ] = useLogoutMutation();

    return (
        <>
            <Container>
                <Header>
                    <Link to="/"><Typography variant="button">Auth App</Typography></Link>
                    <Link to="/protected" ><Typography variant="button">Protected</Typography></Link>
                    {
                        !user?.id &&
                        <>
                            <Link to="/singin" ><Typography variant="button">Sing in</Typography></Link>
                            <Link to="/singup" ><Typography variant="button">Sing up</Typography></Link>
                        </>
                    }
                    {
                        user?.id &&
                        <>
                            <Link to="/" onClick={() => logout()} ><Typography variant="button">Logout</Typography></Link>
                        </>
                    }
                </Header>
            </Container>
            <Outlet />
        </>
    )
}
