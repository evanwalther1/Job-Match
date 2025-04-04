import React, { useEffect, useState } from "react";
//import styles from "/src/css.styles/ActiveJobs.module.css";
import classNames from "classnames";
import {
  ChatMessage,
  getAllChatMessages,
  addChatMessage,
  hasUser,
} from "../FirebaseServices";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "./Navbar";
import ChatBubble from "./ChatBubble";

interface Props {
  recieverID: string;
}

const ChatSendBox = ({ recieverID }: Props) => {
  const [msgTextInput, setMsgTextInput] = useState<string>("");
  const [showInvalidRecieverAlert, setShowInvalidRecieverAlert] =
    useState<boolean>(false);

  useEffect(() => {}, []);

  const sendMessage = async () => {
    if (!hasUser(recieverID)) {
      setShowInvalidRecieverAlert(true);
      return;
    }

    setShowInvalidRecieverAlert(false);

    try {
      const msgID = await addChatMessage({
        sender: auth?.currentUser?.uid,
        senderDisplayName: auth?.currentUser?.displayName,
        reciever: recieverID,
        sendTime: Timestamp.now(),
        text: msgTextInput,
      });
      setMsgTextInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 style={{ paddingTop: 20 }}>Send message</h2>
      <p>{"Invalid reciever: " + showInvalidRecieverAlert}</p>
      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Message text
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          value={msgTextInput}
          rows={3}
          onChange={(e) => setMsgTextInput(e.target.value)}
        ></textarea>
      </div>
      <div className="col-auto">
        <button
          type="submit"
          className="btn btn-primary mb-3"
          onClick={sendMessage}
        >
          Submit message
        </button>
      </div>
    </div>
  );
};

export default ChatSendBox;
