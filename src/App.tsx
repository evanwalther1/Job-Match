import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import JobSearch from "./pages/JobSearch";
import LoginForm from "./components/LoginForm";
import JobHistory from "./pages/JobHistory";
import ActiveJobs from "./pages/ActiveJobs";
import CreateJob from "./pages/CreateJob";
import RegisterUser from "./components/RegisterUser";
import SplashScreen from "./components/SplashScreen";
import Chat from "./pages/Chat";
import "./index.css";
import Layout from "./components/Layout";
import { LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBsLBrx0skjBGUbHq9ezyHn5zuCHp-4KY4">
      <div>
        <BrowserRouter>
          <Routes>
            {/* Public routes - redirect to home if already logged in */}
            <Route
              path="/splash"
              element={<SplashScreen isAuthenticated={user != null} />}
            />
            <Route
              index
              element={
                user ? <Navigate to="/splash" /> : <Navigate to="loginForm" />
              }
            />
            <Route path="/loginForm" element={<LoginForm />} />
            <Route
              path="/register"
              element={user ? <Navigate to="/home" /> : <RegisterUser />}
            />
            {/* Protected routes - redirect to login if not logged in */}
            <Route path="/home" element={<JobSearch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/job-history" element={<JobHistory />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />

            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LoadScript>
  );
};

export default App;
