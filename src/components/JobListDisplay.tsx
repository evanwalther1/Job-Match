import React from "react";
import { Job } from "../FirebaseServices";
import styles from "/src/css.styles/JobListDisplay.module.css";

const JobListDisplay = ({ job }: { job: Job }) => {
  return (
    <>
      <div className={styles.itemBox}>
        <label>{job.title}</label>
      </div>
    </>
  );
};

export default JobListDisplay;
