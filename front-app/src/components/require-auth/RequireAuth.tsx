import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import { useGetMeQuery } from "../../redux/services/auth/auth";

export default function RequireAuth() {
  const { data: user, isLoading, isFetching } = useGetMeQuery();
  const location = useLocation();

  if(isLoading || isFetching) {
    return <CircularProgress />
  }

  if (!user?.id) {
    return <Navigate to="/singin" state={{ from: location }} />;
  }

  return <Outlet />;
}
