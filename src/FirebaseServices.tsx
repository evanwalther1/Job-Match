// src/services/firestoreService.ts
import { db, storage } from "./firebase"; // Import Firestore instance
import { getDownloadURL, listAll, ref } from "firebase/storage";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
  setDoc,
  increment,
} from "firebase/firestore";
import firebase from "firebase/app";
import firestore from "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

export interface Job {
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
  workersFound: boolean;
  completed: boolean;
  lat: number;
  lng: number;
}
export interface ChatMessage {
  id: string;
  sender: string;
  senderDisplayName: string;
  reciever: string;
  sendTime: Timestamp;
  text: string;
}
export interface Relationship {
  followerId: string;
  followingId: string;
}

export interface User {
  age: number;
  displayName: string;
  email: string;
  firstname: string;
  lastLogin: any; // Using any for timestamp, could use Timestamp from firebase/firestore
  lastname: string;
  photoURL: any; // Using 'any' for the map structure
  profilePic: string;
  userId: string;
  username: string;
}

export interface Relationship {
  followerId: string;
  followingId: string;
  id: string;
}

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      console.log("No such user exists");
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), userData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Relationship methods
export const followUser = async (
  followerId: string,
  followingId: string
): Promise<void> => {
  try {
    const relationshipId = `${followerId}_follows_${followingId}`;
    const relationshipData: Relationship = {
      followerId,
      followingId,
      id: relationshipId,
    };
    // Add job to Firestore and get the reference

    await updateDoc(doc(db, "user", followingId), {
      followers: increment(1),
    });
    await updateDoc(doc(db, "user", followerId), {
      following: increment(1),
    });
    await setDoc(doc(db, "relationships", relationshipId), relationshipData);
    console.log("Follow relationship created with ID:", relationshipId);
    // Fetch the newly created job data using the document ID
  } catch (error) {
    console.error("Error followingUser:", error);
    throw error;
  }
};

export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<void> => {
  try {
    const relationshipId = `${followerId}_follows_${followingId}`;
    await deleteDoc(doc(db, "relationships", relationshipId));
    await updateDoc(doc(db, "user", followingId), {
      followers: increment(-1),
    });
    await updateDoc(doc(db, "user", followerId), {
      following: increment(-1),
    });
    console.log(
      `User ${followerId} unfollowed ${followingId} deleting ${relationshipId}`
    );
  } catch (error) {
    console.error("Error removing follow relationship:", error);
    throw error;
  }
};

export const getAllRelationships = async (): Promise<Relationship[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "relationships"));
    const relationships: Relationship[] = [];

    querySnapshot.forEach((doc) => {
      relationships.push(doc.data() as Relationship);
    });

    return relationships;
  } catch (error) {
    console.error("Error getting relationships:", error);
    throw error;
  }
};

export const getUserFollowers = async (
  userId: string
): Promise<Relationship[]> => {
  try {
    const q = query(
      collection(db, "relationships"),
      where("followingId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    const followers: Relationship[] = [];

    querySnapshot.forEach((doc) => {
      followers.push(doc.data() as Relationship);
    });

    return followers;
  } catch (error) {
    console.error("Error getting user followers:", error);
    throw error;
  }
};

export const getUserFollowing = async (
  userId: string
): Promise<Relationship[]> => {
  try {
    const q = query(
      collection(db, "relationships"),
      where("followerId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    const following: Relationship[] = [];

    querySnapshot.forEach((doc) => {
      following.push(doc.data() as Relationship);
    });

    return following;
  } catch (error) {
    console.error("Error getting user following:", error);
    throw error;
  }
};

export const checkIfFollowing = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const relationshipId = `${followerId}_follows_${followingId}`;
    const docSnap = await getDoc(doc(db, "relationships", relationshipId));

    return docSnap.exists();
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw error;
  }
};

export const getJobImages = async (jobID: string): Promise<string[]> => {
  try {
    const imageListRef = ref(storage, `${jobID}/`);
    const result = await listAll(imageListRef); // Get all file references

    // Fetch the download URLs for each image
    const urlsPromises = result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef); // Get download URL for each item
      return url;
    });

    // Wait for all URLs to resolve and return the list of URLs
    return await Promise.all(urlsPromises);
  } catch (err) {
    console.error("Error fetching job images:", err);
    return []; // Return empty array in case of error
  }
};
// Function to get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const jobCollectionRef = collection(db, "jobs");
    const data = await getDocs(jobCollectionRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Job, "id">),
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Function to add a new job
export const addJob = async (jobData: any): Promise<string> => {
  try {
    // Add job to Firestore and get the reference
    const docRef = await addDoc(collection(db, "jobs"), jobData);
    // Fetch the newly created job data using the document ID
    return docRef.id;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

// Function to update a job
export const updateJob = async (jobId: string, updatedData: any) => {
  try {
    const jobDocRef = doc(db, "jobs", jobId);
    await updateDoc(jobDocRef, updatedData);
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Function to delete a job
export const deleteJob = async (jobId: string) => {
  try {
    const jobDocRef = doc(db, "jobs", jobId);
    await deleteDoc(jobDocRef);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

// Function to get all chat messages (copied and modified from getAllJobs)
export const getAllChatMessages = async (): Promise<ChatMessage[]> => {
  try {
    const chatMessageCollectionRef = collection(db, "chatMessages");
    const data = await getDocs(chatMessageCollectionRef);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ChatMessage, "id">),
    }));
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

// Function to add a new chat message (copied and modified from addJob)
export const addChatMessage = async (chatMessageData: any): Promise<string> => {
  try {
    // Add chat message to Firestore and get the reference
    const docRef = await addDoc(
      collection(db, "chatMessages"),
      chatMessageData
    );
    // Fetch the newly created chat message data using the document ID
    return docRef.id;
  } catch (error) {
    console.error("Error adding chat message:", error);
    throw error;
  }
};

export const obscureLocation = (
  lat: number,
  lng: number,
  radiusInMeters: number
): { lat: number; lng: number } => {
  const r = radiusInMeters / 111300; // Convert to degrees (~111.3 km per degree)
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const newLat = lat + w * Math.cos(t);
  const newLng = lng + (w * Math.sin(t)) / Math.cos(lat * (Math.PI / 180));
  return { lat: newLat, lng: newLng };
};

export const saveLocation = async (jobID: string, lat: number, lng: number) => {
  const obscured = obscureLocation(lat, lng, 3000); // 3km privacy radius
  await updateJob(jobID, { lat: obscured.lat, lng: obscured.lng });
};
