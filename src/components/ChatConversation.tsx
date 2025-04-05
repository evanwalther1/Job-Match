import { ReactNode, useState } from "react";
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

  const [messagesWithRightAlignData, setMessagesWithRightAlignData] = useState<
    [ChatMessage, boolean][]
  >([]);
  const [messagesStored, setMessagesStored] = useState<string[]>([]);
  const [returnElement, setReturnElement] = useState<ReactNode>(null);

  const grabMessagesAndSort = async () => {
    const messagesSentByCurrentUser: ChatMessage[] =
      await getMessagesFromOneUserToAnother(currentUserID, otherUserID);
    const messagesSentByOtherUser: ChatMessage[] =
      await getMessagesFromOneUserToAnother(otherUserID, currentUserID);

    messagesSentByCurrentUser.forEach((value) => {
      if (!messagesStored.includes(value.id)) {
        console.log("add message ", value.id);
        console.log("length of messagesStored: ", messagesStored.length);
        messagesStored.push(value.id);
        messagesWithRightAlignData.push([value, false]);
      }
    });
    messagesSentByOtherUser.forEach((value) => {
      if (!messagesStored.includes(value.id)) {
        console.log("add message ", value.id);
        console.log("length of messagesStored: ", messagesStored.length);
        messagesStored.push(value.id);
        messagesWithRightAlignData.push([value, true]);
      }
    });
    console.log(
      "number of data items in the big array: ",
      messagesWithRightAlignData.length
    );

    messagesWithRightAlignData.sort(
      (a, b) => a[0].sendTime.seconds - b[0].sendTime.seconds
    );
  };

  const turnMessagesToUI = () => {
    setReturnElement(
      <>
        {messagesWithRightAlignData.map((value) => {
          return <ChatBubble msg={value[0]} right_aligned={value[1]} />;
        })}
      </>
    );
  };

  grabMessagesAndSort();
  //turnMessagesToUI();

  return (
    <div className="card">
      {returnElement}
      <button
        onClick={() => {
          grabMessagesAndSort();
          turnMessagesToUI();
        }}
      >
        {" "}
        Refresh messages
      </button>
    </div>
  );
};

export default ChatConversation;
