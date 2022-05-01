import {
    Typography,
    Container
} from '@mui/material';
import { Outlet, Link } from "react-router-dom";
import styled from '@emotion/styled';
import { useGetMeQuery } from '../../redux/services/auth/auth';
import { useLogoutMutation } from '../../redux/services/auth/auth';

const Header = styled.header`
  padding: 32px;
  font-size: 24px;
  color: black;
  font-weight: bold;
  display: grid;
  grid-template-columns: 80% 10% 10%;
`;

export default function Layout() {
    const { data: user } = useGetMeQuery();
    const [ logoutTrigger ]  = useLogoutMutation();

    const onClickLogout = async () => {
        logoutTrigger();
    }

    return (
        <>
            <Container>
                <Header>
                    <Link to="/"><Typography variant="h6">Auth App</Typography></Link>
                    {
                        !user &&
                        <>
                            <Link to="/singin"><Typography variant="h6">Sing in</Typography></Link>
                            <Link to="/singup"><Typography variant="h6">Sing up</Typography></Link>
                        </>
                    }
                    {
                        user &&
                        <>
                            <Link to="/" onClick={onClickLogout}><Typography variant="h6">Logout</Typography></Link>
                        </>
                    }
                </Header>
            </Container>
            <Outlet />
        </>
    )
}
