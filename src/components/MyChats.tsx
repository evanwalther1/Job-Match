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
    </div>
  );
};

export default MyChats;
