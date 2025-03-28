import Navbar from "../components/Navbar";
import History from "../components/History";
import ComputerNavBarPadding from "../components/ComputerNavBarPadding";
const JobHistory = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div style={{ paddingTop: ComputerNavBarPadding }}>
        <History></History>
      </div>
    </>
  );
};

export default JobHistory;
