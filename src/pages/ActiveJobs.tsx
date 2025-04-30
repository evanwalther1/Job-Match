import ComputerNavBarPadding from "../components/ComputerNavBarPadding";
import MyJobs from "../components/MyJobs";
import Navbar from "../components/Navbar";
const ActiveJobs = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div style={{ paddingTop: 120 }}>
        <MyJobs></MyJobs>
      </div>
    </>
  );
};

export default ActiveJobs;
