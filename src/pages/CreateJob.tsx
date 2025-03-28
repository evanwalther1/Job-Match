import { useNavigate } from "react-router-dom";
import JobPostForm from "../components/JobPostForm";
import Navbar from "../components/Navbar";
import ComputerNavBarPadding from "../components/ComputerNavBarPadding";
const CreateJob = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div style={{ paddingTop: ComputerNavBarPadding }}>
        <JobPostForm onClose={function (): void {}}></JobPostForm>
      </div>
    </>
  );
};

export default CreateJob;
