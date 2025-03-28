import React, { useEffect, useState } from "react";
//import styles from "/src/css.styles/ActiveJobs.module.css";
import classNames from "classnames";
import {
  ChatMessage,
  getAllChatMessages,
  addChatMessage,
} from "../FirebaseServices";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "./Navbar";

//currently this code means more like "AllChats" while I'm testing and figuring things out
//NOTE - THE MESSAGES DO NOT APPEAR ON THE SCREEN IN REAL TIME; A REFRESH IS REQUIRED

const MyChats = () => {
  const [allChatMsgs, setAllChatMsgs] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const chatMessagesArray: ChatMessage[] = await getAllChatMessages();
        setAllChatMsgs(chatMessagesArray);
      } catch (error) {
        console.error("Error fetching all chat messages:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container">
      <h2>All Messages</h2>
      {allChatMsgs.map((msg) => {
        return (
          <div className="card">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-body-secondary">
                From: {msg.senderDisplayName}
              </h6>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                Sent at: {msg.sendTime.toDate().toString()}
              </h6>
              <p className="card-text">{msg.text}</p>
            </div>
          </div>
        );
      })}

      <h2 style={{ paddingTop: 20 }}>Send message</h2>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Display name of reciever (made up, because the feature doesn't work
          rn)
        </label>
        <input
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Example Name"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Text of message
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={3}
        ></textarea>
      </div>
      <div className="col-auto">
        <button type="submit" className="btn btn-primary mb-3">
          Submit message (doesn't work rn)
        </button>
      </div>
    </div>
  );
};

export default MyChats;
