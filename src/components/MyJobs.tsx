import React, { useEffect, useState } from "react";
import "../css.styles/SearchBar.css";
import { Job, getAllJobs, getJobImages } from "../FirebaseServices";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const MyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employingJobs, setEmployingJobs] = useState<Job[]>([]);
  const [inProgressJobs, setInProgressJobs] = useState<Job[]>([]);
  const [workingJobs, setWorkingJobs] = useState<Job[]>([]);
  const [jobImages, setJobImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobArray: Job[] = await getAllJobs();
        setJobs(jobArray); // ✅ Now setting the resolved array, not a Promise
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      if (!auth.currentUser) {
        console.error("No user is logged in");
        return [];
      }
      let q = query(collection(db, "jobs")); // Start with base query

      q = query(
        collection(db, "jobs"),
        where("employerID", "==", auth.currentUser.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedJobs: Job[] = [];

        querySnapshot.forEach((doc) => {
          fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
        });

        setEmployingJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Fetch images for each job
    const loadJobImages = async () => {
      const images: { [key: string]: string } = {}; // Object to hold image URLs

      try {
        const imagePromises = jobs.map(async (job) => {
          const imageUrls = await getJobImages(job.id); // Get image URLs for the job
          if (imageUrls.length > 0) {
            // Use the first image URL (or you could handle multiple if needed)
            images[job.id] = imageUrls[0];
          }
        });
        await Promise.all(imagePromises);
        setJobImages(images); // Store images URLs in state
      } catch (error) {
        console.error("Error fetching job images:", error);
      }
    };

    if (jobs.length > 0) {
      loadJobImages();
    }
  }, [jobs]);
  return (
    <>
      <div className="search-container">
        <h1 className="search-title">Waiting for Workers</h1>
        <div className="job-cards">
          {employingJobs.length > 0 ? (
            employingJobs.map((job) => (
              <div key={job.id} className="job-card" style={{ width: "18rem" }}>
                <img
                  src={jobImages[job.id] || "..."}
                  className="card-img-top"
                  alt="..."
                ></img>
                <div className="card-body">
                  <h5>{job.title}</h5>
                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p>{job.description}</p>
                  <p>
                    <strong>Pay:</strong> ${job.pay}
                  </p>
                  <div className="payment-methods">
                    <p>
                      <strong>Payment Methods:</strong>
                    </p>
                    <span>{job.cash ? "💵 Cash" : ""}</span>
                    <span>{job.venmo ? "📱 Venmo" : ""}</span>
                    <span>{job.cashApp ? "💰 CashApp" : ""}</span>
                  </div>
                  <a href="#" className="btn btn-primary">
                    Open Job Post
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
      <div className="search-container">
        <h1 className="search-title">In Progress</h1>
        <div className="job-cards">
          {inProgressJobs.length > 0 ? (
            inProgressJobs.map((job) => (
              <div key={job.id} className="job-card" style={{ width: "18rem" }}>
                <img
                  src={jobImages[job.id] || "..."}
                  className="card-img-top"
                  alt="..."
                ></img>
                <div className="card-body">
                  <h5>{job.title}</h5>
                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p>{job.description}</p>
                  <p>
                    <strong>Pay:</strong> ${job.pay}
                  </p>
                  <div className="payment-methods">
                    <p>
                      <strong>Payment Methods:</strong>
                    </p>
                    <span>{job.cash ? "💵 Cash" : ""}</span>
                    <span>{job.venmo ? "📱 Venmo" : ""}</span>
                    <span>{job.cashApp ? "💰 CashApp" : ""}</span>
                  </div>
                  <a href="#" className="btn btn-primary">
                    Open Job Post
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyJobs;
