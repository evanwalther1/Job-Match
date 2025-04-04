import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../css.styles/SearchBar.css";
import { getJobImages } from "../FirebaseServices";
import ReactDOM from "react-dom";
import styles from "/src/css.styles/ActiveJobs.module.css";

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  pay: number;
  cash: boolean;
  venmo: boolean;
  cashApp: boolean;
  date: Date;
  employerID: string;
}

interface MainContentProps {
  searchQuery: string;
  selectedFilters: { [key: string]: string[] };
  filterCategories: string[];
  onCreateNewJob: () => void;
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
  onCreateNewJob,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobImages, setJobImages] = useState<{ [key: string]: string }>({}); // To store job image URLs
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [jobUserData, setJobUserData] = useState<any>(null);

  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    width: "80vw",
    maxWidth: "1000px",
    maxHeight: "90vh",
    overflow: "hidden",
    zIndex: 9999,
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

  const renderJobDetailsPortal = () => {
    const jobImage = jobImages[selectedJob?.id || ""];

    return ReactDOM.createPortal(
      <div style={OVERLAY_STYLES} onClick={handleCloseJobDetailsModal}>
        <div style={MODAL_STYLES} onClick={(e) => e.stopPropagation()}>
          {/* Left Column - Image */}
          <div
            style={{
              width: "50%",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
              minHeight: "600px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px", // Added some padding
            }}
          >
            <img
              src={jobImage}
              alt="Job Image"
              style={{
                width: "90%", // Increased from maxWidth
                height: "90%", // Added height
                objectFit: "cover", // Changed from contain to cover
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Optional: adds a subtle shadow
              }}
            />
          </div>

          {/* Right Column - Job Details */}
          <div
            style={{
              width: "50%",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#333",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "10px",
                }}
              >
                {selectedJob?.title}
              </h1>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "10px", color: "#4a4a4a" }}
                  >
                    <path d="M20 10c0 6-8 0-8 0s-8 6-8 0a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {selectedJob?.location}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "10px", color: "#4a4a4a" }}
                  >
                    <rect
                      width="20"
                      height="14"
                      x="2"
                      y="7"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    ${selectedJob?.pay}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  Job Description
                </h3>
                <p style={{ color: "#666", lineHeight: 1.6 }}>
                  {selectedJob?.description}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    marginBottom: "10px",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  Payment Methods
                </h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  {selectedJob?.cash && (
                    <span
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "5px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      💵 Cash
                    </span>
                  )}
                  {selectedJob?.venmo && (
                    <span
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "5px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      📱 Venmo
                    </span>
                  )}
                  {selectedJob?.cashApp && (
                    <span
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "5px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      💰 CashApp
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "auto",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={handleCloseJobDetailsModal}
              >
                Close
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                Message {jobUserData?.firstname} {jobUserData?.lastname}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById("portal")!
    );
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
            .filter(([_, values]) => values.length > 0) // 只处理有值的过滤条件
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
      <h2 className="text-xl font-bold mb-4">Active Jobs</h2>

      <>
        {showJobDetails ? renderJobDetailsPortal() : null}

        <div className="search-container">
          <button
            onClick={onCreateNewJob}
            className="bg-blue-500 text-black px-4 py-2 rounded"
          >
            Create New Job
          </button>

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
