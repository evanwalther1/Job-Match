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

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const userCollectionRef = collection(db, "user");

  const getProfilePic = () => {
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

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeader}>Your Profile</h1>
        <div className={styles.profileBox}>
          {user && !isEditingProfile ? (
            <div className={styles.profileInfo}>
              <img
                src={getProfilePic()}
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
                src={getProfilePic()}
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
    </>
  );
};

export default Profile;
