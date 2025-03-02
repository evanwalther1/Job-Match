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
} from "firebase/firestore";
const Profile = () => {
  const [userList, setUserList] = useState<any[]>([]);

  //New user state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [age, setAge] = useState(0);
  const [newUsername1, setNewUsername1] = useState("");

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

  useEffect(() => {
    getUserList();
  }, []);

  const updateUsername = async (id: string) => {
    const userDoc = doc(db, "user", id);
    await updateDoc(userDoc, { username: newUsername1 });
    getUserList();
  };

  const onSubmitUser = async () => {
    try {
      await addDoc(userCollectionRef, {
        username: newUsername,
        password: newPassword,
        age: age,
        userId: auth?.currentUser?.uid,
      });
      getUserList();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id: string) => {
    const userDoc = doc(db, "user", id);
    await deleteDoc(userDoc);
    getUserList();
  };

  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <h1>Profile</h1>
      <div>
        {userList.map((user) => (
          <div key={user.id}>
            <h1> {user.username} </h1>
            <p> Age: {user.age} </p>
            <button onClick={() => deleteUser(user.id)}> Delete User</button>
            <input
              placeholder="new username..."
              onChange={(e) => setNewUsername1(e.target.value)}
            ></input>
            <button onClick={() => updateUsername(user.id)}>
              Update username
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          placeholder="username"
          onChange={(e) => setNewUsername(e.target.value)}
        ></input>
        <input
          placeholder="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          placeholder="age"
          type="number"
          onChange={(e) => setAge(Number(e.target.value))}
        ></input>
        <button onClick={onSubmitUser}> Submit Movie </button>
      </div>
    </>
  );
};

export default Profile;
