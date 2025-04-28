import ChatConversation from "./ChatConversation";
import ChatSendBox from "./ChatSendBox";

interface Props {
  otherUserID: string;
}

const ChatLog = ({ otherUserID }: Props) => {
  return (
    <>
      <ChatConversation otherUserID={otherUserID} />
      <ChatSendBox recieverID={otherUserID} />
    </>
  );
};

export default ChatLog;
