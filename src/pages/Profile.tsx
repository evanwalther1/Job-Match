import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase";
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
} from "firebase/firestore";
import styles from "/src/css.styles/Profile.module.css";
import profilePic from "../assets/profilepic.png";
import "/src/css.styles/Profile.module.css";
const Profile = () => {
  const [user, setUser] = useState<any>(auth.currentUser);

  //New user state
  const [newUsername, setNewUsername] = useState("");
  const [age, setAge] = useState(0);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const userCollectionRef = collection(db, "user");

  useEffect(() => {
    console.log("Fetching user data...");

    const currentUser = auth.currentUser;
    if (!currentUser) return; // If no user is authenticated, don't run the query

    // Set up the query to get the specific user based on userId
    const q = query(userCollectionRef, where("userId", "==", currentUser.uid));

    // Real-time listener to fetch user data based on the query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data(); // Get the first document's data
        setUser(userData); // Update the user state
      } else {
        console.log("No user data found.");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [auth.currentUser]); // Re-run effect when the currentUser changes

  const editProfile = async () => {
    setIsEditingProfile(true);
  };

  const submitForm = async (id: string) => {
    setIsEditingProfile(false);
    const userDoc = doc(db, "user", id);
    await updateDoc(userDoc, {
      age: age,
      username: newUsername,
      firstname: newFirstName,
      lastname: newLastName,
    });
  };

  const deleteUser = async (id: string) => {
    const userDoc = doc(db, "user", id);
    await deleteDoc(userDoc);
  };

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeader}>Your Profile</h1>

        {user && !isEditingProfile ? (
          <div className={styles.profileInfo}>
            <img
              src={profilePic}
              alt="Profile Avatar"
              className={styles.profileAvatar}
            />
            <div className={styles.profileItem}>
              <h1>
                <span className="label">{user.firstname}</span>
              </h1>
            </div>
            <div className={styles.profileItem}>
              <h1>
                <span className="label">{user.lastname}</span>
              </h1>
            </div>
            <div className={styles.profileItem}>
              <h1>
                <span className="label">{user.email}</span>
              </h1>
            </div>
            <div className={styles.profileItem}>
              <h1>
                <span className="label">{user.username}</span>
              </h1>
            </div>
            <div className={styles.profileItem}>
              <p>{user.age}</p>
            </div>
            <button onClick={editProfile} className={styles.profileBtn}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className={styles.profileInfo}>
            <h1>Edit Your Profile</h1>
            <img
              src={profilePic}
              alt="Profile Avatar"
              className={styles.profileAvatar}
            />
            <input
              onChange={(e) => setNewFirstName(e.target.value)}
              placeholder={user.firstname}
            ></input>
            <input
              onChange={(e) => setNewLastName(e.target.value)}
              placeholder={user.lastname}
            ></input>
            <h1>
              <span className="label">{user.email}</span>
            </h1>
            <input
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={user.username}
            ></input>
            <input
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder={user.age}
            ></input>

            <form>
              <button
                className={styles.profileBtn}
                onClick={() => submitForm(user.userId)}
              >
                Submit
              </button>
            </form>
            <button
              className={styles.profileBtn}
              onClick={() => deleteUser(user.userId)}
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
