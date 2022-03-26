import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./routes/Layout";
import Home from "./routes/Home";
import Admin from "./routes/Admin";
import Feedback from "./routes/Feedback";
import EmptyVoid from "./routes/EmptyVoid";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="*" element={<EmptyVoid />} />
        </Route>
      </Routes>
    </BrowserRouter>);
}

export default App;
