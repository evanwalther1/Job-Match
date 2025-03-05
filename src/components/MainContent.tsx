import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../css.styles/SearchBar.css";
import { getJobImages } from "../FirebaseServices";

interface Job {
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

interface MainContentProps {
  searchQuery: string;
  filterCategories: string[];
}

const MainContent: React.FC<MainContentProps> = ({
  searchQuery,
  filterCategories,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobImages, setJobImages] = useState<{ [key: string]: string }>({}); // To store job image URLs

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

        const filteredResults = fetchedJobs.filter(
          (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  useEffect(() => {
    // Fetch images for each job
    const loadJobImages = async () => {
      const images: { [key: string]: string } = {}; // Object to hold image URLs

      for (const job of jobs) {
        try {
          const imageUrls = await getJobImages(job.id); // Get image URLs for the job
          if (imageUrls.length > 0) {
            // Use the first image URL (or you could handle multiple if needed)
            images[job.id] = imageUrls[0];
          }
        } catch (error) {
          console.error(`Error fetching image for job ${job.id}:`, error);
        }
      }

      setJobImages(images); // Store images URLs in state
    };

    if (jobs.length > 0) {
      loadJobImages();
    }
  }, [jobs]);

  return (
    <div className="search-container">
      <h1 className="search-title">Search Results</h1>
      {loading ? <p>Loading...</p> : null}

      <div className="job-cards">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="job-card" style={{ width: "18rem" }}>
              <img
                src={jobImages[job.id] || "..."}
                className="card-img-top"
                alt="..."
              ></img>
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
                  <span>{job.cashApp ? "💰 CashApp" : ""}</span>
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

export default MainContent;
