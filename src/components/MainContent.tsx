import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../css.styles/SearchBar.css";
import { getJobImages } from "../FirebaseServices";
import ReactDOM from "react-dom";
import styles from "/src/css.styles/ActiveJobs.module.css";
import UserProfileModal from "./UserProfileModal";
import JobDetailsModal from "./JobDetailsModal";
import { Link } from "react-router-dom";
import ChatConversation from "./ChatConversation";
import ChatSendBox from "./ChatSendBox";
import { Job } from "../FirebaseServices";

interface MainContentProps {
  searchQuery: string;
  selectedFilters: { [key: string]: string[] };
  filterCategories: string[];
}

const categoryOptions: {
  [key: string]: { value: number | string; label: string }[];
} = {
  Payment: [
    { value: 0, label: "$0 - $50" },
    { value: 50, label: "$50 - $100" },
    { value: 100, label: "$100 - $150" },
    { value: 150, label: "$150+" },
  ],
  Location: [
<<<<<<< HEAD
    { value: "USA", label: "USA" },
    { value: "Europe", label: "Europe" },
    { value: "Asia", label: "Asia" },
    { value: "Other", label: "Other" },
  ], //might use different way to achieve that.
=======
    { value: 0, label: "< 1 mile" },
    { value: 1, label: "< 2 miles" },
    { value: 2, label: "< 5 miles" },
    { value: 5, label: "> 5 miles" },
  ],
>>>>>>> 04616a722c8621265a2cbd4abe9f3db9de0a8270
  PayWay: [
    { value: "Cash", label: "Cash" },
    { value: "Venmo", label: "Venmo" },
    { value: "CashApp", label: "CashApp" },
  ],
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
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
    overflow: "auto",
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

  const getDistanceFromLatLonInMiles = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

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
                <Link aria-current="page" to="/chat" style={{ color: "white" }}>
                  Message {jobUserData?.firstname} {jobUserData?.lastname}
                </Link>
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
            .filter(([_, values]) => values.length > 0)
            .every(([key, values]) => {
              if (key === "Payment") {
                const pay = Number(job.pay);
                return values.some((v) => {
                  switch (Number(v)) {
                    case 0:
                      return pay <= 50;
                    case 50:
                      return pay > 50 && pay <= 100;
                    case 100:
                      return pay > 100 && pay <= 150;
                    case 150:
                      return pay > 150;
                    default:
                      return false;
                  }
                });
              }

              if (key === "Location" && userLocation) {
                return values.some((val) => {
                  const distance = getDistanceFromLatLonInMiles(
                    userLocation.lat,
                    userLocation.lng,
                    job.lat, // assuming you store job's lat
                    job.lng // assuming you store job's lng
                  );

                  switch (Number(val)) {
                    case 0:
                      return distance < 1;
                    case 1:
                      return distance < 2;
                    case 2:
                      return distance < 5;
                    case 5:
                      return distance >= 5;
                    default:
                      return false;
                  }
                });
              }

              if (key === "PayWay") {
                return values.some((method) => {
                  const methodLower = method.toLowerCase();
                  return (
                    (methodLower === "cash" && job.cash) ||
                    (methodLower === "venmo" && job.venmo) ||
                    (methodLower === "cashapp" && job.cashApp)
                  );
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
