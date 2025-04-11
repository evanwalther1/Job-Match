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
        messagesWithRightAlignData.push([value, false]);
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
        messagesWithRightAlignData.push([value, true]);
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

  console.log("line 93");
  grabMessagesAndSort();
  console.log("line 95");
  //turnMessagesToUI();

  return (
    <div className="card">
      {returnElement}
      <button
        onClick={() => {
          console.log("onClick start");
          grabMessagesAndSort();
          turnMessagesToUI();
          console.log("onClick end");
        }}
      >
        {" "}
        Refresh messages
      </button>
    </div>
  );
};

export default ChatConversation;
