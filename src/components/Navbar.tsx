import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Auth, signOut } from "firebase/auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import profilePic from "../assets/profilepic.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(auth.currentUser);
  const logOut = async () => {
    try {
      const result = await signOut(auth);
      console.log("User Signed out successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("setting user to" + user);
      setUser(user); // Automatically updates the user state
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <h1 className="navbar-brand" style={{ fontSize: 40 }}>
            Job-Match
          </h1>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  <img
                    src={profilePic} // Replace with actual profile image URL
                    alt="Profile"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                      marginLeft: "10px",
                    }}
                  />
                  Your account
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/home"
                  style={{ marginRight: "10px", marginLeft: "20px" }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  style={{ marginRight: "10px" }}
                  onClick={logOut}
                >
                  Logout
                </button>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Jobs
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/job-search">
                      Job Search
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/job-history">
                      Job History
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/active-jobs">
                      Active Jobs
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/create-job">
                      Create Job
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
