import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "/src/css.styles/JobPostForm.module.css";
import classNames from "classnames";

import { addJob } from "../FirebaseServices";
const JobPostForm = () => {
  //New Job States
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDate, setNewJobDate] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState(0);
  const [cashAccept, setCashAccept] = useState(false);
  const [venmoAccept, setVenmoAccept] = useState(false);
  const [cashAppAccept, setCashAppAccept] = useState(false);
  const [newImages, setImages] = useState("");

  const onPostJob = async () => {
    try {
      await addJob({
        title: newJobTitle,
        description: newJobDescription,
        date: newJobDate,
        location: newJobLocation,
        pay: newPaymentAmount,
        cash: cashAccept,
        venmo: venmoAccept,
        cashApp: cashAppAccept,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <div>
          <label>Create a New Job</label>
        </div>
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Job Title</label>
            <input
              id="title"
              placeholder="Building a Fence"
              onChange={(e) => setNewJobTitle(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              placeholder="City/Town/Neighborhood"
              onChange={(e) => setNewJobLocation(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Job Description</label>
            <div className={styles.description}>
              <textarea
                id="description"
                placeholder="Assemble a fence using a posthole digger and the wood that I painted..."
                onChange={(e) => setNewJobDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="amount">Pay Amount in $</label>
            <input
              id="amount"
              placeholder="50"
              type="number"
              onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="images">Image</label>
            <input id="images" type="image"></input>
          </div>
          <div className={styles.inputGroup}>
            <label>Payment Options</label>
            <div className={styles.paymentGroup}>
              <input
                type="checkbox"
                id="cash"
                value="Cash"
                onChange={(e) => setCashAccept(e.target.checked)}
              />
              <label htmlFor="cash"> Cash </label>
              <input
                type="checkbox"
                id="venmo"
                value="Venmo"
                onChange={(e) => setVenmoAccept(e.target.checked)}
              />
              <label htmlFor="venmo"> Venmo </label>
              <input
                type="checkbox"
                id="cashapp"
                value="CashApp"
                onChange={(e) => setCashAppAccept(e.target.checked)}
              />
              <label htmlFor="cashapp"> CashApp </label>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="date">Date Completed by</label>
            <input
              id="date"
              type="date"
              onChange={(e) => setNewJobDate(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.postButton}>
              <button onClick={onPostJob}>Post Job</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobPostForm;
