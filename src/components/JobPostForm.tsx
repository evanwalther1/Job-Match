import React from "react";
import { Link } from "react-router-dom";
import styles from "/src/css.styles/JobPostForm.module.css";
import classNames from "classnames";

const JobPostForm = () => {
  return (
    <>
      <div className={styles.formContainer}>
        <div>
          <label>Create a New Job</label>
        </div>
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Job Title</label>
            <input id="title" placeholder="Building a Fence"></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="location">Location</label>
            <input id="location" placeholder="City/Town/Neighborhood"></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Job Description</label>
            <div className={styles.description}>
              <textarea
                id="description"
                placeholder="Assemble a fence using a posthole digger and the wood that I painted..."
              ></textarea>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="amount">Pay Amount in $</label>
            <input id="amount" placeholder="50" type="number"></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="images">Image</label>
            <input id="images" type="image"></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="paytype">Payment Options</label>
            <div id="paytype" className={styles.paymentGroup}>
              <input type="checkbox" id="cash" value="Cash" />
              <label htmlFor="cash"> Cash </label>
              <input type="checkbox" id="venmo" value="Venmo" />
              <label htmlFor="venmo"> Venmo </label>

              <input type="checkbox" id="cashapp" value="CashApp" />
              <label htmlFor="cashapp"> CashApp </label>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.postButton}>
              <button>Post Job</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobPostForm;
