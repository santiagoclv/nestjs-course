import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/require-auth/RequireAuth";
import Home from "./pages/home/Home";
import Layout from "./pages/layout";
import NotFound from "./pages/not-found/NotFound";
import Protected from "./pages/protected/Protected";

const externalRedirect = (externalLink: string) => () => {
  window.location.href = externalLink;
  return null;
}

function App() {
  const SingUp = externalRedirect('http://localhost:3000/auth/singup');
  const SingIn = externalRedirect('http://localhost:3000/auth/singin');
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/singin' element={<SingIn />}/>
          <Route path='/singup' element={<SingUp />}/>
          <Route element={<RequireAuth />}>
            <Route path="protected" element={<Protected />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
