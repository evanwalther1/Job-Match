import Navbar from "../components/Navbar";
import MyChats from "../components/MyChats";
import ComputerNavBarPadding from "../components/ComputerNavBarPadding";
const Chat = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div style={{ paddingTop: ComputerNavBarPadding }}>
        <MyChats />
      </div>
    </>
  );
};

export default Chat;
