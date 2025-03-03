import React from "react";
import styles from "/src/css.styles/LoginForm.module.css";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/profilepic.png";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const RegisterUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [age, setAge] = useState(0);
  const navigate = useNavigate();
  const [userList, setUserList] = useState<any[]>([]);
  const userCollectionRef = collection(db, "user");

  const getUserList = async () => {
    try {
      const data = await getDocs(userCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setUserList(filteredData);
    } catch (err) {}
  };

  const signIn = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      await setDoc(doc(db, "user", user.uid), {
        // 🔹 Use setDoc instead of addDoc
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        age: age,
        userId: user.uid, // 🔹 Ensure userId matches Firestore doc ID
        photoURL: { profilePic },
      });

      getUserList();
      console.log(result.user);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <div>
          <label>Create a new Account!</label>
        </div>
        <div className={styles.loginBox}>
          <input
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          ></input>
          <input
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          ></input>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          ></input>
          <input
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter Username"
          ></input>
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            type="password"
          ></input>

          <input
            type="number"
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="Enter Birthday"
          ></input>
          <button
            onClick={signIn}
            className={classNames("btn", "btn-secondary", styles.submitButton)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterUser;
