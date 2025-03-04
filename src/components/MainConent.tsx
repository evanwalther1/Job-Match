import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./SearchBar.css";

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  pay: number;
  cash: boolean;
  venmo: boolean;
  cashapp: boolean;
  date: Date;
  employerID: string;
}

interface MainConentProps {
  searchQuery: string;
  filterCategories: string[];
}

const MainConent: React.FC<MainConentProps> = ({
  searchQuery,
  filterCategories,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      let q = query(collection(db, "jobs")); // Start with base query

      if (filterCategories.length > 0 && filterCategories.length <= 10) {
        q = query(
          collection(db, "jobs"),
          where("category", "in", filterCategories)
        );
      }

      try {
        const querySnapshot = await getDocs(q);
        const fetchedJobs: Job[] = [];

        querySnapshot.forEach((doc) => {
          fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
        });

        const filteredResults = fetchedJobs.filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setJobs(filteredResults);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, filterCategories]);

  return (
    <div className="search-container">
      <h1 className="search-title">Search Results</h1>
      {loading ? <p>Loading...</p> : null}

      <div className="job-cards">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="job-card" style={{ width: "18rem" }}>
              <img src="..." className="card-img-top" alt="..."></img>
              <div className="card-body">
                <h5>{job.title}</h5>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>{job.description}</p>
                <p>
                  <strong>Pay:</strong> ${job.pay}
                </p>
                <div className="payment-methods">
                  <p>
                    <strong>Payment Methods:</strong>
                  </p>
                  <span>{job.cash ? "💵 Cash" : ""}</span>
                  <span>{job.venmo ? "📱 Venmo" : ""}</span>
                  <span>{job.cashapp ? "💰 CashApp" : ""}</span>
                </div>
                <a href="#" className="btn btn-primary">
                  Open Job Post
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default MainConent;
