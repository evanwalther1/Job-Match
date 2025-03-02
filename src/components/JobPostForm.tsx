import React from "react";
import { Link } from "react-router-dom";
import styles from "/src/css.styles/JobPostForm.module.css";
import classNames from "classnames";

const JobPostForm = () => {
  return (
    <>
      <div className={styles.formContainer}>
        <div>
          <label>Create a Job</label>
        </div>
      </div>
    </>
  );
};

export default JobPostForm;
