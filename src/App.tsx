import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import JobSearch from "./pages/JobSearch";
import LoginForm from "./pages/LoginForm";
const App = () => {
  return (
    <div>
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<LoginForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobsearch" element={<JobSearch />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
};

export default App;
