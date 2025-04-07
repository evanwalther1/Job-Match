import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../css.styles/SearchBar.css";
import { getJobImages } from "../FirebaseServices";
import ReactDOM from "react-dom";
import styles from "/src/css.styles/ActiveJobs.module.css";
import UserProfileModal from "./UserProfileModal";
import JobDetailsModal from "./JobDetailsModal";
import { Job } from "../FirebaseServices";

interface MainContentProps {
  searchQuery: string;
  selectedFilters: { [key: string]: string[] };
  filterCategories: string[];
}

const categoryOptions: { [key: string]: (string | number)[] } = {
  Payment: [0, 50, 100, 150],
  Location: ["USA", "Europe", "Asia", "Other"],
  PayWay: ["Cash", "Venmo", "CashApp"],
};

export const MainContent: React.FC<MainContentProps> = ({
  searchQuery,
  selectedFilters,
  filterCategories,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobImages, setJobImages] = useState<{ [key: string]: string }>({}); // To store job image URLs
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [jobUserData, setJobUserData] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleOpenJobDetailsModal = (job: Job) => {
    setSelectedJob(job);
    fetchJobUserDetails(job); // Fetch user details when opening the modal
    setShowJobDetails(true);
  };

  const handleCloseJobDetailsModal = () => {
    setSelectedJob(null);
    setShowJobDetails(false);
  };

  const fetchJobUserDetails = async (job: Job) => {
    try {
      console.log("Employer ID:", job.employerID);

      let jobUserQuery = query(
        collection(db, "user"),
        where("userId", "==", job.employerID)
      );
      const jobUser = await getDocs(jobUserQuery);

      if (!jobUser.empty) {
        const userDoc = jobUser.docs[0];
        const userData = userDoc.data();
        console.log("setting userData to:", userData);
        setJobUserData(userData);
      } else {
        console.warn("No user found for employer ID:", job.employerID);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      try {
        let q = query(
          collection(db, "jobs"), // Start with base query
          where("completed", "==", false),
          where("workersFound", "==", false)
        );

        if (filterCategories.length > 0 && filterCategories.length <= 10) {
          q = query(q, where("category", "in", filterCategories));
        }

        const querySnapshot = await getDocs(q);
        const fetchedJobs = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Job)
        );
        const filteredResults = fetchedJobs.filter((job) => {
          const matchesSearch =
            !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase());

          if (Object.keys(selectedFilters).length === 0) return true;

          const matchesFilters = Object.entries(selectedFilters)
            .filter(([_, values]) => values.length > 0)
            .every(([key, values]) => {
              if (key === "Payment") {
                const pay = job.pay;
                return values.some((v) => {
                  const range = Number(v);
                  return (
                    (range === 0 && pay <= 50) ||
                    (range === 50 && pay > 50 && pay <= 100) ||
                    (range === 100 && pay > 100 && pay <= 150) ||
                    (range === 150 && pay > 150)
                  );
                });
              }

              if (key === "Location") {
                return values.includes(job.location.toLowerCase());
              }

              if (key === "PayWay") {
                return values.some((method) => {
                  if (method === "cash") return job.cash;
                  if (method === "venmo") return job.venmo;
                  if (method === "cashapp") return job.cashApp;
                  return false;
                });
              }

              return true;
            });

          return matchesSearch && matchesFilters;
        });

        setJobs(filteredResults);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, filterCategories, selectedFilters]);

  const loadJobImages = async () => {
    const images: { [key: string]: string } = {};
    try {
      const imagePromises = jobs.map(async (job) => {
        const imageUrls = await getJobImages(job.id);
        if (imageUrls.length > 0) {
          images[job.id] = imageUrls[0];
        }
      });
      await Promise.all(imagePromises);
      setJobImages(images);
    } catch (error) {
      console.error("Error fetching job images:", error);
    }
  };

  useEffect(() => {
    // Fetch images for each job

    if (jobs.length > 0) {
      loadJobImages();
    }
  }, [jobs]);

  return (
    <div>
      <>
        {showJobDetails ? (
          <JobDetailsModal
            setShowProfile={setShowProfile}
            jobImages={jobImages}
            selectedJob={selectedJob}
            jobUserData={jobUserData}
            handleJobCloseDetailsModal={handleCloseJobDetailsModal}
          ></JobDetailsModal>
        ) : null}
        {showProfile ? (
          <UserProfileModal
            userData={jobUserData}
            onClose={() => {
              setShowProfile(false);
            }}
          ></UserProfileModal>
        ) : null}

        <div className="search-container">
          <h1 className="search-title">Search Results</h1>
          {loading ? <p>Loading...</p> : null}

          <div className="job-cards">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={jobImages[job.id] || "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt={job.title}
                  />
                  <div className="card-body">
                    <h5>{job.title}</h5>
                    <p>
                      <strong>Location:</strong> {job.location}
                    </p>
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
                        onClick={() => {
                          handleOpenJobDetailsModal(job),
                            setShowJobDetails(true);
                        }}
                        className={styles.smallbtn}
                      >
                        Open Job Post
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No jobs found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default MainContent;
