import { ChatMessage } from "../FirebaseServices";

interface Props {
  msg: ChatMessage;
  right_aligned?: boolean;
}

const ChatBubble = ({ msg, right_aligned = false }: Props) => {
  return (
    <div
      className={"card" + (right_aligned ? " text-end" : "")}
      key={msg.id}
      style={{
        backgroundColor: right_aligned ? "white" : "beige",
        margin: 5,
        padding: 0,
      }}
    >
      <div className="card-body" style={{ margin: 5, padding: 2 }}>
        <p className="card-text" style={{ paddingBottom: 0, marginBottom: 0 }}>
          {msg.text}
        </p>
        <p
          className="fst-italic"
          key={msg.id}
          style={{
            paddingTop: 0,
            marginTop: 0,
            paddingBottom: 0,
            marginBottom: 0,
            fontSize: "80%",
          }}
        >
          Sent at: {msg.sendTime.toDate().toString()}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
