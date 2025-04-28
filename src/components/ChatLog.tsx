import ChatConversation from "./ChatConversation";
import ChatSendBox from "./ChatSendBox";

interface Props {
  otherUserID: string;
  otherUserDisplayName: string;
}

const ChatLog = ({ otherUserID, otherUserDisplayName }: Props) => {
  return (
    <>
      <ChatConversation
        otherUserID={otherUserID}
        otherUserDisplayName={otherUserDisplayName}
      />
      <ChatSendBox recieverID={otherUserID} />
    </>
  );
};

export default ChatLog;
