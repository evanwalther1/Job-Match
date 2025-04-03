import React, { useEffect, useState } from "react";
//import styles from "/src/css.styles/ActiveJobs.module.css";
import classNames from "classnames";
import {
  ChatMessage,
  getAllChatMessages,
  getChatMessagesByQuery,
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

//currently this code means more like "AllChats" while I'm testing and figuring things out
//NOTE - THE MESSAGES DO NOT APPEAR ON THE SCREEN IN REAL TIME; A REFRESH IS REQUIRED

const MyChats = () => {
  const [allChatMsgs, setAllChatMsgs] = useState<ChatMessage[]>([]);
  const [recieverIDInput, setRecieverIDInput] = useState<string>("");
  const [msgTextInput, setMsgTextInput] = useState<string>("");
  const [showInvalidRecieverAlert, setShowInvalidRecieverAlert] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchAllChatMsgs = async () => {
      try {
        let messagesQuery = query(
          collection(db, "chatMessages"),
          where("reciever", "==", auth?.currentUser?.uid)
        );

        const chatMessagesArray: ChatMessage[] = await getChatMessagesByQuery(
          messagesQuery
        );
        setAllChatMsgs(chatMessagesArray);
      } catch (error) {
        console.error("Error fetching user's chat messages:", error);
      }
    };
    fetchAllChatMsgs();
  }, []);

  const sendMessage = async () => {
    if (!hasUser(recieverIDInput)) {
      setShowInvalidRecieverAlert(true);
      return;
    }

    setShowInvalidRecieverAlert(false);

    try {
      const msgID = await addChatMessage({
        sender: auth?.currentUser?.uid,
        senderDisplayName: auth?.currentUser?.displayName,
        reciever: recieverIDInput,
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
      <h2>Your messages</h2>
      {allChatMsgs.map((msg) => {
        return (
          <div className="card" key={msg.id}>
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
      <p>{"Invalid reciever: " + showInvalidRecieverAlert}</p>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          User ID [one day, display name] of reciever (made up, because the
          feature doesn't work rn)
        </label>
        <input
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Example Name"
          value={recieverIDInput}
          onChange={(e) => setRecieverIDInput(e.target.value)}
        />
      </div>
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

export default MyChats;
