import React, { useEffect, useState } from "react";
import styles from "/src/css.styles/ActiveJobs.module.css";
import classNames from "classnames";
import {
  Job,
  deleteJob,
  getAllJobs,
  getJobImages,
  updateJob,
} from "../FirebaseServices";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const MyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employingJobs, setEmployingJobs] = useState<Job[]>([]);
  const [inProgressJobs, setInProgressJobs] = useState<Job[]>([]);
  const [workingJobs, setWorkingJobs] = useState<Job[]>([]);
  const [jobImages, setJobImages] = useState<{ [key: string]: string }>({});

  const complete = async (job: Job) => {
    try {
      await updateJob(job.id, { completed: true }); // Pass the boolean inside an object
      console.log("Job updated successfully!");
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const workers = async (job: Job, workers: boolean) => {
    try {
      await updateJob(job.id, { workersFound: workers }); // Pass the boolean inside an object
      console.log("Job updated successfully!");
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobArray: Job[] = await getAllJobs();
        setJobs(jobArray);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      console.error("No user is logged in");
      return;
    }

    const q = query(
      collection(db, "jobs"),
      where("employerID", "==", auth.currentUser.uid),
      where("completed", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];

      // Split jobs into categories dynamically
      setEmployingJobs(fetchedJobs.filter((job) => !job.workersFound));
      setInProgressJobs(fetchedJobs.filter((job) => job.workersFound));
    });

    return () => unsubscribe(); // Cleanup listener on unmount
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
                  <div className={styles.buttoncontainer}>
                    <button
                      className={styles.smallbtn}
                      onClick={() => workers(job, true)}
                    >
                      Worker/s Found
                    </button>
                    <button
                      className={styles.smallbtn}
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete Job
                    </button>
                    <a href="#" className={styles.smallbtn}>
                      Edit Job
                    </a>
                  </div>
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
                  <div className={styles.buttoncontainer}>
                    <button
                      className={styles.smallbtn}
                      onClick={() => workers(job, false)}
                    >
                      Look for New Worker/s
                    </button>
                    <button
                      className={styles.smallbtn}
                      onClick={() => complete(job)}
                    >
                      Job Completed
                    </button>
                  </div>
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
