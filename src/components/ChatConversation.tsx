import { useState } from "react";
import { auth } from "../firebase";
import {
  ChatMessage,
  getMessagesFromOneUserToAnother,
} from "../FirebaseServices";
import ChatBubble from "./ChatBubble";

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

  const messagesWithRightAlignData: [ChatMessage, boolean][] = [];

  const grabMessagesAndSort = async () => {
    const messagesSentByCurrentUser: ChatMessage[] =
      await getMessagesFromOneUserToAnother(currentUserID, otherUserID);
    const messagesSentByOtherUser: ChatMessage[] =
      await getMessagesFromOneUserToAnother(otherUserID, currentUserID);

    messagesSentByCurrentUser.forEach((value) =>
      messagesWithRightAlignData.push([value, false])
    );
    messagesSentByOtherUser.forEach((value) =>
      messagesWithRightAlignData.push([value, true])
    );

    messagesWithRightAlignData.sort(
      (a, b) => a[0].sendTime.seconds - b[0].sendTime.seconds
    );
  };

  grabMessagesAndSort();

  return (
    <div className="card">
      {messagesWithRightAlignData.map((value) => {
        return <ChatBubble msg={value[0]} right_aligned={value[1]} />;
      })}
      <button onClick={() => grabMessagesAndSort()}> Refresh messages</button>
    </div>
  );
};

export default ChatConversation;
