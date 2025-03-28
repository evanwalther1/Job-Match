import Navbar from "../components/Navbar";
import React from "react";
import { useEffect, useState } from "react";
import { getAllJobs } from "../FirebaseServices";
import { Job } from "../FirebaseServices";
import ComputerNavBarPadding from "../components/ComputerNavBarPadding";
const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getAllJobs();
        setJobs(jobData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div style={{ paddingTop: ComputerNavBarPadding }}>
        <h2>Job Listings</h2>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>{job.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
