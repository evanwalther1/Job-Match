import React from "react";
import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import profilePic from "../assets/profilepic.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const result = await signOut(auth);
      console.log("User Signed out successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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

            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
