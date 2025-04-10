import React from "react";
import ReactDOM from "react-dom";
import "../css.styles/UserProfileModal.css"; // Assuming you have a CSS file for styles
import { followUser, unfollowUser } from "../FirebaseServices";
import { auth } from "../firebase"; // Import auth from your firebase configuration
import { getAuth } from "firebase/auth";
import {
  addDoc,
  setDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Make sure db is imported
import { useEffect } from "react";
interface Props {
  onClose: () => void;
  userData: {
    age: number;
    displayName: string;
    email: string;
    firstname: string;
    lastname: string;
    lastLogin: any; // Firebase timestamp
    photoURL?: any;
    profilePic: string;
    userId: string;
    username: string;
    dateJoined?: string;
  };
}

const UserProfileModal: React.FC<Props> = ({ onClose, userData }) => {
  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
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
    zIndex: 9999, // Slightly lower than modal, but still very high
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [following, setFollowing] = React.useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid;

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUserId || !userData.userId) return;

      try {
        const relationshipId = `${currentUserId}_follows_${userData.userId}`;
        const relationshipDoc = await getDoc(
          doc(db, "relationships", relationshipId)
        );

        setFollowing(relationshipDoc.exists());
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [currentUserId, userData.userId]);

  const handleToggleFollow = () => {
    if (!following) {
      if (currentUserId !== undefined) {
        // Now TypeScript knows currentUserId is definitely a string
        console.log("following a user");
        followUser(currentUserId, userData.userId);
      } else {
        // Handle the case where user is not logged in
        console.error("User must be logged in to follow others");
        // Maybe show a login prompt
      }
    } else {
      if (currentUserId !== undefined) {
        // Now TypeScript knows currentUserId is definitely a string
        console.log("unfollowing a user");
        unfollowUser(currentUserId, userData.userId);
      } else {
        // Handle the case where user is not logged in
        console.error("User must be logged in to follow others");
        // Maybe show a login prompt
      }
    }
    setFollowing(!following);
  };

  const getProfilePic = () => {
    console.log("User data:", userData);
    console.log(
      "photoURL type:",
      userData?.photoURL
        ? typeof userData.photoURL
        : "userData.photoURL is null/undefined"
    );
    console.log("photoURL value:", userData?.photoURL);

    if (!userData) return "../assets/profilepic.png";

    if (typeof userData.photoURL === "string") {
      return userData.photoURL;
    } else if (userData.photoURL?.profilePic) {
      return userData.photoURL.profilePic;
    } else {
      return "../assets/profilepic.png";
    }
  };

  // Format the date joined
  const formatDateJoined = () => {
    if (!userData.dateJoined) return "N/A";
    const date = new Date(userData.dateJoined);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Sample active job listings (you'll replace with real data)
  const activeJobs = [
    { id: 1, title: "Lawn Mowing", date: "Apr 15, 2025", status: "Open" },
    {
      id: 2,
      title: "Furniture Assembly",
      date: "Apr 20, 2025",
      status: "Open",
    },
    {
      id: 3,
      title: "House Cleaning",
      date: "Apr 25, 2025",
      status: "Open",
    },
  ];

  const renderUserProfile = () => {
    return ReactDOM.createPortal(
      <div style={OVERLAY_STYLES} onClick={onClose}>
        <div style={MODAL_STYLES} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", height: "100%", maxHeight: "90vh" }}>
            {/* Left Column - Profile Info */}
            <div
              style={{
                width: "35%",
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={getProfilePic()}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h2
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "1.8rem",
                  fontWeight: 600,
                }}
              >
                {userData.displayName}
              </h2>
              <p
                style={{ margin: "5px 0 0 0", color: "#666", fontSize: "1rem" }}
              >
                @{userData.username}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
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
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Message
                </button>

                <button
                  className="follow-button"
                  onClick={() => {
                    {
                      handleToggleFollow();
                    }
                  }}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {!following ? (
                    <>
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
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      Follow
                    </>
                  ) : (
                    <>
                      <svg
                        className="checkmark"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Following
                    </>
                  )}
                </button>
              </div>

              <div style={{ marginTop: "30px", width: "100%" }}>
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    marginBottom: "15px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#555",
                    }}
                  >
                    Member Info
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "8px" }}
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
                      Joined JobMatch in {formatDateJoined()}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "8px" }}
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Last active{" "}
                      {new Date(userData.lastLogin).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "8px" }}
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Age: {userData.age}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#555",
                    }}
                  >
                    Contact Info
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "8px" }}
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      {userData.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Job Listings & Activities */}
            <div
              style={{
                width: "65%",
                padding: "30px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Active Job Listings
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {activeJobs.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      style={{
                        padding: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                          }}
                        >
                          {job.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.9rem",
                              color: "#666",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ marginRight: "5px" }}
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
                            {job.date}
                          </span>
                          <span
                            style={{
                              fontSize: "0.85rem",
                              backgroundColor: "#e6f2ff",
                              color: "#0066cc",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontWeight: 500,
                            }}
                          >
                            {job.status}
                          </span>
                        </div>
                      </div>
                      <button
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#f0f0f0",
                          color: "#333",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "30px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  No active job listings
                </div>
              )}

              <div style={{ marginTop: "40px" }}>
                <h2
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Recent Activity
                </h2>
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <p>No recent activity to display</p>
                </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                <h2
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  Reviews
                </h2>
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <p>No reviews yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById("portal")!
    );
  };

  return <>{renderUserProfile()}</>;
};

export default UserProfileModal;
