import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/not-found/NotFound";
import SignIn from "./pages/sing-in/SingIn";
import SignUp from "./pages/sing-up/SingUp";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="singup" element={<SignUp />} />
          <Route path="singin" element={<SignIn />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
