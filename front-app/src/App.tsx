import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./pages/layout";
import NotFound from "./pages/not-found/NotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;