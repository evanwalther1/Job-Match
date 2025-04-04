import { ChatMessage } from "../FirebaseServices";

interface Props {
  msg: ChatMessage;
  right_aligned?: boolean;
}

const ChatBubble = ({ msg, right_aligned = false }: Props) => {
  return (
    <div className={"card" + (right_aligned ? " text-end" : "")} key={msg.id}>
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-body-secondary">
          From: {msg.senderDisplayName}
        </h6>
        <h6 className="card-subtitle mb-2 text-body-secondary">
          Sent at: {msg.sendTime.toDate().toString()}
        </h6>
        <p className="card-text">{msg.text}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
