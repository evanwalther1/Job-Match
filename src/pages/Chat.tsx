import Navbar from "../components/Navbar";
// REPLACE WITH CHAT COMPONENT WHEN DONE
import MyChats from "../components/MyChats";
const Chat = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div>
        <MyChats />
      </div>
    </>
  );
};

export default Chat;
