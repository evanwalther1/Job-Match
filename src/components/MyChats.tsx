import React, { ReactNode, useEffect, useState } from "react";
//import styles from "/src/css.styles/ActiveJobs.module.css";
import classNames from "classnames";
import {
  ChatMessage,
  getAllChatMessages,
  addChatMessage,
  hasUser,
  getAllUsers,
  getUser,
  User,
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
import ChatConversation from "./ChatConversation";
import ChatSendBox from "./ChatSendBox";
import UserProfileModal from "./UserProfileModal";

//currently this code means more like "AllChats" while I'm testing and figuring things out
//NOTE - THE MESSAGES DO NOT APPEAR ON THE SCREEN IN REAL TIME; A REFRESH IS REQUIRED

const MyChats = () => {
  if (auth.currentUser == null) {
    return <></>;
  }
  const [conversationPartnerID, setConversationPartnerID] =
    useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [conversation, setConversation] = useState<ReactNode>(<></>);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userArray: User[] = await getAllUsers();
        setUsers(userArray);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const getProfilePic = (user: User) => {
    console.log("User data:", user);
    console.log(
      "photoURL type:",
      user?.photoURL
        ? typeof user.photoURL
        : "jobUserData.photoURL is null/undefined"
    );
    console.log("photoURL value:", user?.photoURL);

    if (!user) return "../assets/profilepic.png";

    if (typeof user.photoURL === "string") {
      return user.photoURL;
    } else if (user.photoURL?.profilePic) {
      return user.photoURL.profilePic;
    } else {
      return "../assets/profilepic.png";
    }
  };

  const switchConversation = (newID: string) => {
    setConversationPartnerID(newID);
  };

  return (
    <div className="container">
      <div className="row align-items-start">
        <div className="col">
          {users.length == 0 ? (
            <></>
          ) : (
            users.map((value) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <img
                    src={getProfilePic(value)}
                    alt="Profile"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div style={{ marginLeft: "16px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        {value.firstname} {value.lastname}
                      </h3>
                    </div>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        color: "#666",
                        fontSize: "0.9rem",
                      }}
                    >
                      Member since{" "}
                      {new Date(
                        value.joinDate || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => switchConversation(value.userId)}
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Chat
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginLeft: "4px" }}
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="col">
          {users.map((value) => {
            if (value.userId == conversationPartnerID) {
              /*return (
              <UserProfileModal
                userData={value}
                onClose={() => {
                  setConversationPartnerID("");
                }}
              ></UserProfileModal>
            );*/
              return (
                <div>
                  <ChatConversation otherUserID={value?.userId} />
                  <ChatSendBox recieverID={value?.userId} />
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default MyChats;
