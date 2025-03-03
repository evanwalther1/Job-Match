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
  Unsubscribe,
} from "firebase/firestore";
import styles from "/src/css.styles/Profile.module.css";
import profilePic from "../assets/profilepic.png";
import "/src/css.styles/Profile.module.css";
import classNames from "classnames";
import { onAuthStateChanged } from "firebase/auth";
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
        <div className={styles.profileBox}>
          {user && !isEditingProfile ? (
            <div className={styles.profileInfo}>
              <img
                src={user.photoURL?.profilePic ?? user.photoURL}
                alt="Profile Photo"
                className={styles.profileAvatar}
              />
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
                src={user.photoURL?.profilePic ?? user.photoURL}
                alt="Profile Photo"
                className={styles.profileAvatar}
              />

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
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder={user?.age}
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
    </>
  );
};

export default Profile;
