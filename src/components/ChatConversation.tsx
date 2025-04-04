import {
  ChatMessage,
  getMessagesFromOneUserToAnother,
} from "../FirebaseServices";
import ChatBubble from "./ChatBubble";

interface Props {
  currentUserID: string;
  otherUserID: string;
}

const ChatConversation = async ({ currentUserID, otherUserID }: Props) => {
  const messagesSentByCurrentUser: ChatMessage[] =
    await getMessagesFromOneUserToAnother(currentUserID, otherUserID);
  const messagesSentByOtherUser: ChatMessage[] =
    await getMessagesFromOneUserToAnother(otherUserID, currentUserID);

  const data: [ChatMessage, boolean][] = [];
  messagesSentByCurrentUser.forEach((value) => data.push([value, false]));
  messagesSentByOtherUser.forEach((value) => data.push([value, true]));

  data.sort((a, b) => a[0].sendTime.seconds - b[0].sendTime.seconds);

  return (
    <div className="container">
      {data.map((value) => {
        return <ChatBubble msg={value[0]} right_aligned={value[1]} />;
      })}
    </div>
  );
};

export default ChatConversation;
