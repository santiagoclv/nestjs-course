import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
  const auth = { user: null } // get user data;
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/singin" state={{ from: location }} />;
  }

  return <Outlet />;
}
