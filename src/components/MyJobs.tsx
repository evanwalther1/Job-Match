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
import ReactDOM from "react-dom";
import JobEditForm from "./JobEditForm";

const MyJobs = () => {
  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    padding: "50px", // Increased padding for visibility
    zIndex: 9999, // Very high z-index to ensure it's on top
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const OVERLAY_STYLES: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 9998, // Slightly lower than modal, but still very high
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  useEffect(() => {
    if (isEditJobModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditJobModalOpen]);

  const handleOpenEditJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsEditJobModalOpen(true);
  };

  const handleCloseEditJobModal = () => {
    setSelectedJob(null);
    setIsEditJobModalOpen(false);
  };

  // Render the portal first, outside of the main return
  const renderPortal = () => {
    if (!isEditJobModalOpen) return null;

    return ReactDOM.createPortal(
      <div style={OVERLAY_STYLES} onClick={handleCloseEditJobModal}>
        <div style={MODAL_STYLES} onClick={(e) => e.stopPropagation()}>
          <JobEditForm onClose={handleCloseEditJobModal} job={selectedJob} />
        </div>
      </div>,
      document.getElementById("portal")!
    );
  };

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
      {renderPortal()}
      <div className="search-container">
        <h1 className={styles.bigheader}>Waiting for Workers</h1>
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
                    <button
                      className={styles.smallbtn}
                      onClick={() => handleOpenEditJobModal(job)}
                    >
                      Edit Job
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
      <div className="search-container">
        <h1 className={styles.bigheader}>In Progress</h1>
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
