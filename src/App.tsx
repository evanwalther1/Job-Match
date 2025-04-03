import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import JobSearch from "./pages/JobSearch";
import LoginForm from "./components/LoginForm";
import JobHistory from "./pages/JobHistory";
import ActiveJobs from "./pages/ActiveJobs";
import CreateJob from "./pages/CreateJob";
import RegisterUser from "./components/RegisterUser";
import Chat from "./pages/Chat";
import "./index.css";
import Layout from "./components/Layout";
const App = () => {
  return (
    <div>
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<LoginForm />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/home" element={<JobSearch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/job-history" element={<JobHistory />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
};

export default App;
