import React from "react";
import ReactDOM from "react-dom";
import { Job } from "../FirebaseServices";
import { CircleMap } from "./CircleMap";
import ChatConversation from "./ChatConversation";
import ChatSendBox from "./ChatSendBox";
import ChatLog from "./ChatLog";
import { Timestamp } from "firebase/firestore";

interface Props {
  setShowProfile: (show: boolean) => void;
  jobUserData: any;
  jobImages: { [key: string]: string };
  selectedJob: Job | null;
  handleJobCloseDetailsModal: () => void;
}

const JobDetailsModal: React.FC<Props> = ({
  handleJobCloseDetailsModal,
  jobUserData,
  jobImages,
  selectedJob,
  setShowProfile,
}) => {
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
    zIndex: 1000,
  };

  const OVERLAY_STYLES: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1000, // Slightly lower than modal, but still very high
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const getProfilePic = () => {
    console.log("User data:", jobUserData);
    console.log(
      "photoURL type:",
      jobUserData?.photoURL
        ? typeof jobUserData.photoURL
        : "jobUserData.photoURL is null/undefined"
    );
    console.log("photoURL value:", jobUserData?.photoURL);

    if (!jobUserData) return "../assets/profilepic.png";

    if (typeof jobUserData.photoURL === "string") {
      return jobUserData.photoURL;
    } else if (jobUserData.photoURL?.profilePic) {
      return jobUserData.photoURL.profilePic;
    } else {
      return "../assets/profilepic.png";
    }
  };

  const renderJobDetailsPortal = () => {
    const jobImage = jobImages[selectedJob?.id || ""];

    return ReactDOM.createPortal(
      <div style={OVERLAY_STYLES}>
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
              padding: "20px",
            }}
          >
            <img
              src={jobImage}
              alt="Job Image"
              style={{
                width: "90%",
                height: "90%",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
              overflow: "auto",
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

              {/* Job Owner Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <img
                  src={getProfilePic()}
                  alt="Profile"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <div style={{ marginLeft: "16px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3
                      style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}
                    >
                      {jobUserData?.firstname} {jobUserData?.lastname}
                    </h3>
                    <span
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        marginLeft: "10px",
                        fontWeight: 500,
                      }}
                    >
                      JOB OWNER
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                    Member since{" "}
                    {new Date(
                      jobUserData?.joinDate || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  View Profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: "4px" }}
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    width: "fit-content",
                    marginBottom: "30px",
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
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {selectedJob?.date
                      ? selectedJob.date.toDate().toLocaleDateString()
                      : "No due date"}
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
                    <path d="M20 10c0 6-8 0-8 0s-8 6-8 0a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {selectedJob?.location}
                  </p>
                </div>

                <div
                  style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
                >
                  <CircleMap
                    lat={selectedJob?.lat ?? 41.8781}
                    lng={selectedJob?.lng ?? -87.5298}
                  />
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
            <h3
              style={{
                marginBottom: "10px",
                color: "#333",
                fontWeight: 600,
              }}
            >
              Contact About Job
            </h3>
            {
              <ChatLog
                otherUserID={jobUserData?.userId}
                otherUserDisplayName={jobUserData?.displayName}
              />
            }
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
                padding: "16px 0",
              }}
            >
              <button
                style={{
                  position: "fixed",
                  top: "10px",
                  right: "10px",
                  width: "30px",
                  height: "30px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                  transition: "background-color 0.2s",
                  zIndex: "1000",
                }}
                onClick={handleJobCloseDetailsModal}
              >
                ✕
              </button>
              {/*<button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contact About Job
              </button>
              */}
            </div>
          </div>
        </div>
      </div>,
      document.getElementById("portal")!
    );
  };

  return <div>{renderJobDetailsPortal()}</div>;
};

export default JobDetailsModal;
