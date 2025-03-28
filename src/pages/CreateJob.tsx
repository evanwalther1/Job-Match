import { useNavigate } from "react-router-dom";
import JobPostForm from "../components/JobPostForm";
import Navbar from "../components/Navbar";
const CreateJob = () => {
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div>
        <JobPostForm onClose={function (): void {}}></JobPostForm>
      </div>
    </>
  );
};

export default CreateJob;
