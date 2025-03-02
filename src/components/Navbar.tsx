import React from "react";
import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
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
                <a className="nav-link active" aria-current="page" href="/home">
                  Home
                </a>
              </li>
              <button onClick={logOut}>Logout</button>
              <li className="nav-item">
                <a className="nav-link" href="/profile">
                  Profile
                </a>
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
                    <a className="dropdown-item" href="/job-search">
                      Job Search
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/job-history">
                      Job History
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/active-jobs">
                      Active Jobs
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/create-job">
                      Create Job
                    </a>
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
              ></input>
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
