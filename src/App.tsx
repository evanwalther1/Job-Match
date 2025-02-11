import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import JobSearch from "./pages/JobSearch";
import LoginForm from "./pages/LoginForm";
import JobHistory from "./pages/JobHistory";
import ActiveJobs from "./pages/ActiveJobs";
import CreateJob from "./pages/CreateJob";
const App = () => {
  return (
    <div>
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<LoginForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/job-history" element={<JobHistory />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />
            <Route path="/create-job" element={<CreateJob />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
};

export default App;
