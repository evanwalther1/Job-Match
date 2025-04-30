import React from "react";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { Auth, signOut } from "firebase/auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "/src/css.styles/Navbar.module.css";

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

  const MODAL_STYLES: React.CSSProperties = {
    zIndex: 100,
  };

  const getProfilePic = () => {
    console.log("User data:", user);
    console.log(
      "photoURL type:",
      user?.photoURL ? typeof user.photoURL : "user.photoURL is null/undefined"
    );
    console.log("photoURL value:", user?.photoURL);

    if (!user) return "../assets/profilepic.png";

    if (typeof user.photoURL === "string") {
      return user.photoURL;
    } else if (user.photoURL?.profilePic) {
      return user.photoURL.profilePic;
    } else {
      return "../assets/profilepic.png";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Auth user found:", currentUser.uid);
        // Get a reference to the user document in Firestore
        const userDocRef = doc(db, "user", currentUser.uid);

        // Listen for changes to that document
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            console.log("Firestore data updated:", docSnapshot.data());
            setUser({
              ...currentUser,
              ...docSnapshot.data(), // Combine auth user with Firestore data
            });
          } else {
            console.log("No user document found");
            setUser(currentUser);
          }
        });

        // Return cleanup function for Firestore listener
        return () => unsubscribeFirestore();
      } else {
        console.log("No authenticated user");
        setUser(null);
      }
    });

    // Return cleanup function for auth listener
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav
        style={MODAL_STYLES}
        className="navbar navbar-expand-lg navbar-light bg-light fixed-top"
      >
        <div className="container-fluid" style={MODAL_STYLES}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4f63cd 0%, #647dee 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 20px rgba(79, 99, 205, 0.3)",
                marginRight: "15px",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                J
              </span>
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "400",
                color: "#000000", // Changed to black
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Job<span style={{ color: "#000000" }}>Match</span>{" "}
              {/* Changed to black */}
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    style={{ marginLeft: "10px" }}
                    className={styles.navbtn}
                    to="/profile"
                  >
                    <img
                      src={getProfilePic()}
                      alt="Profile"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        marginLeft: "20px",
                      }}
                    />
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    aria-current="page"
                    to="/home"
                    className={styles.navbtn}
                    style={{ marginRight: "50px", marginLeft: "60px" }}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={styles.navbtn}
                    aria-current="page"
                    to="/active-jobs"
                    style={{ marginRight: "50px", marginLeft: "40px" }}
                  >
                    Active Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={styles.navbtn}
                    aria-current="page"
                    to="/job-history"
                    style={{ marginRight: "50px", marginLeft: "40px" }}
                  >
                    History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={styles.navbtn}
                    aria-current="page"
                    to="/chat"
                    style={{ marginRight: "50px", marginLeft: "40px" }}
                  >
                    Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className={styles.logoutbtn}
                    style={{ marginLeft: "30px" }}
                    onClick={logOut}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
