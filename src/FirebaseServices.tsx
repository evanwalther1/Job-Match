// src/services/firestoreService.ts
import { db, storage } from "./firebase"; // Import Firestore instance
import { ref } from "firebase/storage";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
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
}
{
  /*}
export const getJobImages = async (jobID: string): Promise<File[]> => {
  try {
    const imageListRef = ref(storage, `${jobID}/`);
  } catch (err) {
    console.error(err);
  }
};*/
}
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
