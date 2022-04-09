import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout, Home, Admin, Feedback, EmptyVoid, Login, Profile } from "./routes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<EmptyVoid />} />
        </Route>
      </Routes>
    </BrowserRouter>);
}

export default App;
