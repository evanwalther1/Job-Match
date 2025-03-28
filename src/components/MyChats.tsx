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

  //<div class="card" style="width: 18rem;">
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" className="btn btn-primary">
          Go somewhere
        </a>
      </div>
    </div>
  );
};

export default MyChats;
