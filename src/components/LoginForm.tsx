import React from "react";
import { Link } from "react-router-dom";
import styles from "/src/css.styles/LoginForm.module.css";
import classNames from "classnames";

const LoginForm = () => {
  return (
    <>
      <div className={styles.loginContainer}>
        <div>
          <label>Login to JobMatch!</label>
        </div>
        <div className={styles.loginBox}>
          <label htmlFor="exampleInputusername">Email address</label>

          <input
            type="email"
            className="form-control"
            id="username"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />

          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />

          <Link
            to="/home"
            className={classNames("btn", "btn-primary", styles.submitButton)}
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
