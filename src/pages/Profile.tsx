import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, auth, storage } from "../firebase";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import styles from "/src/css.styles/Profile.module.css";
import "/src/css.styles/Profile.module.css";
import classNames from "classnames";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ComputerNavBarPadding from "../components/ComputerNavBarPadding";
import { unfollowUser, User } from "../FirebaseServices";
import UserProfileModal from "../components/UserProfileModal";
import { profileEvents } from "../FirebaseServices";

const Profile = () => {
  const [user, setUser] = useState<any>(auth.currentUser);
  const [ageCheck, setAgeCheck] = useState(false);
  //New user state
  const [newUsername, setNewUsername] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const navigate = useNavigate();
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newLat, setNewLat] = useState();
  const [newLng, setNewLng] = useState();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Add these state variables in your component function
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<any>([]);
  const [followingList, setFollowingList] = useState<any>([]);
  const [followersListData, setFollowersListData] = useState<any>([]);
  const [followingListData, setFollowingListData] = useState<any>([]);

  const [openProfile, setOpenProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User>(user);

  const userCollectionRef = collection(db, "user");

  const [, setRefreshToken] = useState(0);

  // Toggle functions for the modals
  const toggleFollowersModal = () => setShowFollowersModal(!showFollowersModal);
  const toggleFollowingModal = () => setShowFollowingModal(!showFollowingModal);

  const getProfilePic = (user: any) => {
    console.log("User data:", user);
    console.log(
      "photoURL type:",
      user?.photoURL ? typeof user.photoURL : "user.photoURL is null/undefined"
    );
    console.log("photoURL value:", user?.photoURL);

    if (!user) return "../assets/profilepic.png";

    if (typeof user.photoURL === "string") {
      return user.photoURL;
    } else if (user.photoURL?.profilePic) {
      return user.photoURL.profilePic;
    } else {
      return "../assets/profilepic.png";
    }
  };

  useEffect(() => {
    // Real-time listener to fetch user data based on the query
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User authenticated:", currentUser.uid);

        // Reference the Firestore document for this user
        const userDocRef = doc(db, "user", currentUser.uid);

        // Subscribe to Firestore document updates
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUser(docSnapshot.data()); // Update the user state
          } else {
            console.log(
              "No user data found in Firestore. Tried to match " +
                docSnapshot.data() +
                " with " +
                currentUser.uid
            );
            setUser(null);
          }
        });

        // Cleanup Firestore listener when user changes
        return () => unsubscribeFirestore();
      } else {
        console.log("No user logged in.");
        setUser(null);
      }
    });
    // Cleanup authentication listener
    // return () => unsubscribeAuth();
  }, []);

  const editProfile = async () => {
    setIsEditingProfile(true);
  };

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

  const submitForm = async (id: string) => {
    setIsEditingProfile(false);
    setAgeCheck(true);
    const userDoc = doc(db, "user", id);

    const updatedFields: Record<string, any> = {};
    if (newUsername !== "") updatedFields.username = newUsername;
    if (newFirstName !== "") updatedFields.firstname = newFirstName;
    if (newLastName !== "") updatedFields.lastname = newLastName;
    if (age !== null) updatedFields.age = age;
    // Handle file upload if there's a new file
    if (newFile !== null) {
      try {
        // Get Firebase storage references
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${id}`);

        // Upload the file
        await uploadBytes(storageRef, newFile);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Add the photo URL to the updated fields
        updatedFields.photoURL = { profilePic: downloadURL };
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Only perform the update if there are fields to update
    if (Object.keys(updatedFields).length > 0) {
      await updateDoc(userDoc, updatedFields);
    }
  };

  const deleteUser = async (id: string) => {
    const userDoc = doc(db, "user", id);
    await deleteDoc(userDoc);
    navigate("/");
  };

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      // Your followers fetching code
      let followersQuery = query(
        collection(db, "relationships"),
        where("followingId", "==", user.userId)
      );
      const followersSnapshot = await getDocs(followersQuery);
      const followers: string[] = [];
      followersSnapshot.forEach((doc) => {
        followers.push(doc.data().followerId); // Note: I think this should be followerId not followingId
      });
      setFollowersList(followers);

      // Fetch follower user data
      const followersData: any[] = [];
      for (let i = 0; i < followers.length; i++) {
        let userQuery = query(
          collection(db, "user"),
          where("userId", "==", followers[i])
        );
        const userSnapshot = await getDocs(userQuery);
        userSnapshot.forEach((doc) => {
          followersData.push(doc.data());
        });
      }
      setFollowersListData(followersData);

      // Your following fetching code
      let followingQuery = query(
        collection(db, "relationships"),
        where("followerId", "==", user.userId)
      );
      const followingSnapshot = await getDocs(followingQuery);
      const following: string[] = [];
      followingSnapshot.forEach((doc) => {
        following.push(doc.data().followingId);
      });
      setFollowingList(following);

      // Fetch following user data
      const followingData: any[] = [];
      for (let i = 0; i < following.length; i++) {
        let userQuery = query(
          collection(db, "user"),
          where("userId", "==", following[i])
        );
        const userSnapshot = await getDocs(userQuery);
        userSnapshot.forEach((doc) => {
          followingData.push(doc.data());
        });
      }
      setFollowingListData(followingData);
    };

    fetchFollowersAndFollowing();
  }, [user?.userId]); // Dependency array - re-run if userId changes

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: ComputerNavBarPadding }}>
        <div className={styles.profileContainer}>
          <h1 className={styles.profileHeader}>Your Profile</h1>
          <div className={styles.profileBox}>
            {user && !isEditingProfile ? (
              <div className={styles.profileInfo}>
                <img
                  src={getProfilePic(user)}
                  alt="Profile Photo"
                  className={styles.profileAvatar}
                />
                {/* Followers and Following Section */}
                <div className={styles.socialCounters}>
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className={styles.socialCounterBtn}
                  >
                    <span className={styles.socialCounterLabel}>
                      Followers {user?.followers}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className={styles.socialCounterBtn}
                  >
                    <span className={styles.socialCounterLabel}>
                      Following {user?.following}{" "}
                    </span>
                  </button>
                </div>
                <div className={styles.profileItem}>
                  <span className="label">First Name: </span>
                  <span className="label">{user?.firstname}</span>
                </div>
                <div className={styles.profileItem}>
                  <span className="label">Last Name: </span>
                  <span className="label">{user?.lastname}</span>
                </div>
                <div className={styles.profileItem}>
                  <span className="label">Email: </span>
                  <span className="label">{user?.email}</span>
                </div>
                <div className={styles.profileItem}>
                  <span className="label">Username: </span>
                  <span className="label">{user?.username}</span>
                </div>
                <div className={styles.profileItem}>
                  <span className="label">Age: </span>
                  <span className="label">{user?.age}</span>
                </div>

                <button onClick={editProfile} className={styles.profileBtn}>
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className={styles.profileInfo}>
                <h1>Edit Your Profile</h1>
                <img
                  src={getProfilePic(user)}
                  alt="Profile Photo"
                  className={styles.profileAvatar}
                />

                <span>
                  <label>Edit Photo</label>
                  <input
                    id="image"
                    type="file"
                    //accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setNewFile(e.target.files[0]);
                      }
                    }}
                  ></input>
                </span>

                <span>
                  <label>First Name: </label>
                  <input
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder={user?.firstname}
                  ></input>
                </span>
                <span>
                  <label>Last Name: </label>
                  <input
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder={user?.lastname}
                  ></input>
                </span>

                <span>
                  <label>Email: </label>
                  <label> {user?.email}</label>
                </span>

                <span>
                  <label>Username: </label>
                  <input
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={user?.username}
                  ></input>
                </span>
                <span>
                  <label>Age: </label>

                  <input
                    onChange={(e) => {
                      setAge(Number(e.target.value));
                    }}
                    placeholder={user?.age}
                    disabled={ageCheck}
                  ></input>
                </span>

                <form>
                  <button
                    className={styles.profileBtn}
                    onClick={() => {
                      if (auth.currentUser) {
                        submitForm(user.userId);
                      } else {
                        console.log("error submiting");
                      }
                    }}
                  >
                    Submit
                  </button>
                </form>
                <button
                  className={classNames(styles.profileBtn, "btn btn-danger")}
                  onClick={() => deleteUser(user.userId)}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFollowingModal ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 4500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#FFF",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              width: "80vw",
              maxWidth: "1000px",
              maxHeight: "90vh",
              overflow: "hidden",
              zIndex: 4500,
            }}
          >
            <div
              style={{
                padding: "1.25rem",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Following
              </h2>
              <button
                onClick={toggleFollowingModal}
                style={{
                  color: "#6b7280",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div
              style={{
                padding: "0 0.75rem",
                maxHeight: "24rem",
                overflowY: "auto",
              }}
            >
              <div>
                {followingListData.length === 0 ? (
                  <div
                    style={{
                      padding: "2.5rem 0",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <p>You aren't following anyone yet</p>
                  </div>
                ) : (
                  followingListData.map((followedUser: any) => (
                    <div
                      key={followedUser.userId}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 0.75rem",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        style={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: 0,
                          flexGrow: 1,
                        }}
                        onClick={() => {
                          setSelectedProfile(followedUser);
                          setOpenProfile(true);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            width: "100%",
                          }}
                        >
                          <div style={{ flexShrink: 0 }}>
                            <img
                              src={getProfilePic(followedUser)}
                              alt={`${followedUser.firstname} ${followedUser.lastname}`}
                              style={{
                                width: "3rem",
                                height: "3rem",
                                borderRadius: "9999px",
                                objectFit: "cover",
                                border: "1px solid #e5e7eb",
                              }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/48";
                              }}
                            />
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <p
                                style={{
                                  fontWeight: 500,
                                  color: "#111827",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {followedUser.firstname} {followedUser.lastname}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                @{followedUser.username}
                              </p>
                            </div>
                          </div>
                          <div style={{ flexShrink: 0 }}>
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
                              style={{ color: "#9ca3af" }}
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await unfollowUser(user.userId, followedUser.userId);
                          // Refresh the following list data after unfollowing
                          const updatedFollowingList = followingListData.filter(
                            (user: any) => user.userId !== followedUser.userId
                          );
                          setFollowingListData(updatedFollowingList);
                        }}
                        style={{
                          marginLeft: "1rem",
                          padding: "0.375rem 0.75rem",
                          backgroundColor: "#f3f4f6",
                          color: "#4b5563",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          flexShrink: 0,
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#e5e7eb";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#f3f4f6";
                        }}
                      >
                        Unfollow
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showFollowersModal ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 4500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#FFF",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              width: "80vw",
              maxWidth: "1000px",
              maxHeight: "90vh",
              overflow: "hidden",
              zIndex: 4500,
            }}
          >
            <div
              style={{
                padding: "1.25rem",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Followers
              </h2>
              <button
                onClick={toggleFollowersModal}
                style={{
                  color: "#6b7280",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div
              style={{
                padding: "0 0.75rem",
                maxHeight: "24rem",
                overflowY: "auto",
              }}
            >
              <div>
                {followersListData.length === 0 ? (
                  <div
                    style={{
                      padding: "2.5rem 0",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <p>You don't have any followers yet</p>
                  </div>
                ) : (
                  followersListData.map((followingUser: any) => (
                    <div
                      key={followingUser.userId}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 0.75rem",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <button
                        style={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: 0,
                          flexGrow: 1,
                        }}
                        onClick={() => {
                          setSelectedProfile(followingUser);
                          setOpenProfile(true);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            width: "100%",
                          }}
                        >
                          <div style={{ flexShrink: 0 }}>
                            <img
                              src={getProfilePic(followingUser)}
                              alt={`${followingUser.firstname} ${followingUser.lastname}`}
                              style={{
                                width: "3rem",
                                height: "3rem",
                                borderRadius: "9999px",
                                objectFit: "cover",
                                border: "1px solid #e5e7eb",
                              }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/48";
                              }}
                            />
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <p
                                style={{
                                  fontWeight: 500,
                                  color: "#111827",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {followingUser.firstname}{" "}
                                {followingUser.lastname}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                @{followingUser.username}
                              </p>
                            </div>
                          </div>
                          <div style={{ flexShrink: 0 }}>
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
                              style={{ color: "#9ca3af" }}
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {openProfile ? (
        <UserProfileModal
          onClose={() => {
            setOpenProfile(false);
          }}
          userData={selectedProfile}
          onViewJobDetails={(job) => {}}
        ></UserProfileModal>
      ) : null}
    </>
  );
};
export default Profile;
