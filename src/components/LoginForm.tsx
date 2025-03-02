import React from "react";
import { Link } from "react-router-dom";
import styles from "/src/css.styles/LoginForm.module.css";
import classNames from "classnames";
import { useState } from "react";
import { auth, GoogleAuthProvider, signInWithPopup } from "../firebase"; // Adjust path if needed
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        setMessage("Message Successful");
      }
      navigate("/home");
    } catch (err) {
      setMessage("Login Failed. Try Again");
      console.log(err);
    }
  };

  const registerUser = async () => {
    navigate("/register");
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user); // Check the user info, like user.displayName, user.email, etc.
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <div>
          <label>Login to JobMatch!</label>
        </div>
        <div className={styles.loginBox}>
          <label htmlFor="exampleInputusername">Email address</label>

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="username"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />

          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />
          <button
            onClick={registerUser}
            className={classNames("btn", "btn-secondary", styles.submitButton)}
          >
            Create New Account
          </button>
          <button
            onClick={() => loginUser(email, password)}
            className={classNames("btn", "btn-primary", styles.submitButton)}
          >
            Login
          </button>

          <button
            onClick={googleLogin}
            className={classNames("btn", "btn-secondary", styles.submitButton)}
          >
            Google Login
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default LoginForm;
