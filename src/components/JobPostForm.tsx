import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "/src/css.styles/JobPostForm.module.css";
import classNames from "classnames";
import { auth } from "../firebase";
import popupStyles from "/src/css.styles/Popup.module.css";
import { addJob } from "../FirebaseServices";
const JobPostForm = () => {
  const [isOpen, setOpen] = useState(false);
  //New Job States
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDate, setNewJobDate] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState(Number);
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
        employerID: auth?.currentUser?.uid,
      });
      setNewJobTitle("");
      setNewJobDate("");
      setNewJobLocation("");
      setNewJobDescription("");
      setNewPaymentAmount(0);
      setCashAccept(false);
      setVenmoAccept(false);
      setCashAppAccept(false);
      setOpen(true);
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
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              placeholder="City,Town, or Neighborhood"
              value={newJobLocation}
              onChange={(e) => setNewJobLocation(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Job Description</label>
            <div className={styles.description}>
              <textarea
                id="description"
                placeholder="Assemble a fence using a posthole digger and the wood that I painted..."
                value={newJobDescription}
                onChange={(e) => setNewJobDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="amount">Pay Amount in $</label>
            <input
              id="amount"
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
                checked={cashAccept}
                onChange={(e) => setCashAccept(e.target.checked)}
              />
              <label htmlFor="cash"> Cash </label>
              <input
                type="checkbox"
                id="venmo"
                value="Venmo"
                checked={venmoAccept}
                onChange={(e) => setVenmoAccept(e.target.checked)}
              />
              <label htmlFor="venmo"> Venmo </label>
              <input
                type="checkbox"
                id="cashapp"
                value="CashApp"
                checked={cashAppAccept}
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
              value={newJobDate}
              onChange={(e) => setNewJobDate(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.postButton}>
              <button onClick={onPostJob}>Post Job</button>
            </div>
          </div>
        </div>
        <div>
          {isOpen && (
            <div className={popupStyles.popupOverlay}>
              <div className={popupStyles.popupContent}>
                <h2>Job Created! Way to Go!</h2>
                <p>You can now see your job under active jobs</p>
                <button onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobPostForm;
