// src/services/firestoreService.ts
import { db, storage } from "./firebase"; // Import Firestore instance
import { getDownloadURL, listAll, ref } from "firebase/storage";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
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
}
export interface ChatMessage {
  id: string;
  sender: string;
  senderDisplayName: string;
  reciever: string;
  sendTime: Timestamp;
  text: string;
}

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
