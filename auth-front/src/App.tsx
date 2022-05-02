import { Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import SignIn from "./pages/sing-in/SingIn";
import SignUp from "./pages/sing-up/SingUp";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="singup" element={<SignUp />} />
          <Route path="singin" element={<SignIn />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
