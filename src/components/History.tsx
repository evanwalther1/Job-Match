import React, { useEffect, useState } from "react";
import { Job } from "../FirebaseServices";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
const History = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    if (!auth.currentUser) {
      console.error("No user is logged in");
      return;
    }

    const q = query(
      collection(db, "jobs"),
      where("employerID", "==", auth.currentUser.uid),
      where("completed", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];

      // Split jobs into categories dynamically
      setJobs(fetchedJobs);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <>
      <div className="search-container">
        <h1 className="search-title">Completed Jobs</h1>
        <div className="job-cards">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="job-card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5>{job.title}</h5>
                  <p>{job.description}</p>
                  <p>
                    <strong>Pay:</strong> ${job.pay}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
