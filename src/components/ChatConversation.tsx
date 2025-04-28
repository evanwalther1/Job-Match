import { ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  ChatMessage,
  getMessagesFromOneUserToAnother,
  getUser,
} from "../FirebaseServices";
import ChatBubble from "./ChatBubble";
import { Timestamp } from "firebase/firestore";

interface Props {
  otherUserID: string;
}

const ChatConversation = ({ otherUserID }: Props) => {
  const currentUserID = auth.currentUser?.uid;
  if (currentUserID == null || currentUserID == undefined) {
    return (
      <div className="container">
        <p>
          The current user ID cannot be found; this chat conversation cannot be
          loaded.
        </p>
      </div>
    );
  }
  if (otherUserID == null || otherUserID == undefined) {
    return (
      <div className="container">
        <p>
          The user ID of the current user's conversation partner cannot be
          found; this chat conversation cannot be loaded.
        </p>
      </div>
    );
  }

  const [messagesWithRightAlignData, setMessagesWithRightAlignData] = useState<
    [ChatMessage, boolean][]
  >([]);
  const [messagesStored, setMessagesStored] = useState<string[]>([]);
  const [returnElement, setReturnElement] = useState<ReactNode>(null);
  const [otherUserName, setOtherUserName] = useState<string>("");

  const grabMessagesAndSort = async () => {
    console.log("grabMessagesAndSort - start");
    const messagesSentByCurrentUser: ChatMessage[] =
      await getMessagesFromOneUserToAnother(currentUserID, otherUserID);
    const messagesSentByOtherUser: ChatMessage[] =
      await getMessagesFromOneUserToAnother(otherUserID, currentUserID);

    messagesSentByCurrentUser.forEach((value) => {
      if (!messagesStored.includes(value.id)) {
        console.log("grabMessagesAndSort - add message ", value.id);
        console.log(
          "grabMessagesAndSort - length of messagesStored: ",
          messagesStored.length
        );
        messagesStored.push(value.id);
        messagesWithRightAlignData.push([value, true]);
      }
    });
    messagesSentByOtherUser.forEach((value) => {
      if (!messagesStored.includes(value.id)) {
        console.log("grabMessagesAndSort - add message ", value.id);
        console.log(
          "grabMessagesAndSort - length of messagesStored: ",
          messagesStored.length
        );
        messagesStored.push(value.id);
        messagesWithRightAlignData.push([value, false]);
      }
    });
    console.log(
      "grabMessagesAndSort - number of data items in the big array: ",
      messagesWithRightAlignData.length
    );

    messagesWithRightAlignData.sort(
      (a, b) => a[0].sendTime.seconds - b[0].sendTime.seconds
    );
    console.log("grabMessagesAndSort - end");
  };

  const turnMessagesToUI = () => {
    console.log("turnMessagesToUI");
    setReturnElement(
      <>
        {messagesWithRightAlignData.map((value) => {
          return <ChatBubble msg={value[0]} right_aligned={value[1]} />;
        })}
      </>
    );
  };

  const getOtherUserName = async () => {
    const otherUser = await getUser(otherUserID);
    //CURRENT PROBLEM: THE GETUSER() CALLS ARE RETURNING USER DOES NOT EXIST
    /*console.log("entering while loop - hold tight");
    while (otherUser == null) {
      //kill time
    }
    console.log("exiting while loop");*/
    if (otherUser == null) {
      console.log("the other user call is null; returning");
      return;
    }
    setOtherUserName(otherUser.displayName);
  };

  useEffect(() => {
    grabMessagesAndSort();
    getOtherUserName();
    turnMessagesToUI();
  });

  return (
    <div className="card">
      {returnElement}
      <div className="card">
        <div className="card">
          <p>{otherUserName == "" ? "Them" : otherUserName}</p>
        </div>
        <div className="card text-end">
          <p>{"You"}</p>
        </div>
      </div>
      <button
        onClick={() => {
          console.log("onClick start");
          grabMessagesAndSort();
          turnMessagesToUI();
          console.log("onClick end");
        }}
      >
        {" "}
        Show/Refresh messages
      </button>
    </div>
  );
};

export default ChatConversation;
