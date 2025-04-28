import { auth } from "../firebase";
import ChatConversation from "./ChatConversation";
import ChatSendBox from "./ChatSendBox";

interface Props {
  otherUserID: string;
  otherUserDisplayName: string;
}

const ChatLog = ({ otherUserID, otherUserDisplayName }: Props) => {
  if (otherUserID == auth.currentUser?.uid) {
    return <p>You cannot chat with yourself.</p>;
  }
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
