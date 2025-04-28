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
  otherUserDisplayName: string;
}

const ChatConversation = ({ otherUserID, otherUserDisplayName }: Props) => {
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

  useEffect(() => {
    grabMessagesAndSort();
    turnMessagesToUI();
  });

  return (
    <div className="card">
      {returnElement}
      <div className="card">
        <div className="card">
          <p style={{ margin: 5 }}>{otherUserDisplayName}</p>
        </div>
        <div className="card text-end">
          <p style={{ margin: 5 }}>{"You"}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
