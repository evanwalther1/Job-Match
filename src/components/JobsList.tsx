import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import styles from "/src/css.styles/ActiveJobs.module.css";
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

interface JobsListProps {
  searchQuery: string;
  selectedFilters: { [key: string]: string[] };
}

const JobsList: React.FC<JobsListProps> = ({
  searchQuery,
  selectedFilters,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobImages, setJobImages] = useState<{ [key: string]: string }>({});

  const fetchJobs = async () => {
    setLoading(true);
    const q = query(collection(db, "jobs"));
    const querySnapshot = await getDocs(q);
    const jobsData: Job[] = [];
    querySnapshot.forEach((doc) => {
      jobsData.push({ id: doc.id, ...doc.data() } as Job);
    });
    setJobs(jobsData);
    setFilteredJobs(jobsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (loading) return;

    console.log("Filtering jobs with:", { searchQuery, selectedFilters, jobs });
    const filtered = jobs.filter((job) => {
      // 1. Search Filter
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. Payment Filter
      if (selectedFilters.Payment?.length > 0) {
        const pay = job.pay;
        let payMatch = false;
        selectedFilters.Payment.forEach((rangeStr) => {
          const range = Number(rangeStr);
          if (range === 0 && pay <= 50) payMatch = true;
          else if (range === 50 && pay > 50 && pay <= 100) payMatch = true;
          else if (range === 100 && pay > 100 && pay <= 150) payMatch = true;
          else if (range === 150 && pay > 150) payMatch = true;
        });
        if (!payMatch) return false;
      }

      // 3. Location Filter
      if (
        selectedFilters.Location?.length > 0 &&
        !selectedFilters.Location.includes(job.location.toLowerCase())
      ) {
        return false;
      }

      // 4. PayWay Filter
      if (selectedFilters.PayWay?.length > 0) {
        const jobPaymentMethods: string[] = [];
        if (job.cash) jobPaymentMethods.push("cash");
        if (job.venmo) jobPaymentMethods.push("venmo");
        if (job.cashApp) jobPaymentMethods.push("cashapp");

        console.log("PayWay Check:", {
          jobId: job.id,
          jobPaymentMethods,
          selectedPayWays: selectedFilters.PayWay,
          match: selectedFilters.PayWay.some((method) =>
            jobPaymentMethods.includes(method)
          ),
        });

        if (
          !selectedFilters.PayWay.some((method) =>
            jobPaymentMethods.includes(method)
          )
        ) {
          return false;
        }
      }

      return true;
    });

    console.log("Filtered Jobs Result:", filtered);
    setFilteredJobs(filtered);
  }, [searchQuery, selectedFilters, jobs, loading]);

  // loading img
  useEffect(() => {
    if (!loading && filteredJobs.length > 0) {
      loadJobImages();
    }
  }, [filteredJobs]);

  const loadJobImages = async () => {
    const images: { [key: string]: string } = {};
    try {
      const imagePromises = filteredJobs.map(async (job) => {
        const imageUrls = await getJobImages(job.id);
        if (imageUrls.length > 0) {
          images[job.id] = imageUrls[0];
        }
      });
      await Promise.all(imagePromises);
      setJobImages(images);
    } catch (error) {
      console.error("Error fetching job images:", error);
    }
  };

  // processing click event
  const handleOpenJobDetailsModal = (job: Job) => {
    console.log("Opening job details for:", job.id);
  };

  const [showJobDetails, setShowJobDetails] = useState(false);

  return (
    <div className="search-container">
      <h1 className="search-title">Search Results</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="job-cards">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card" style={{ width: "18rem" }}>
                <img
                  src={jobImages[job.id] || "https://via.placeholder.com/150"}
                  className="card-img-top"
                  alt={job.title}
                />
                <div className="card-body">
                  <h5>{job.title}</h5>
                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>
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
                  <div className={styles.buttoncontainer}>
                    <button
                      onClick={() => {
                        handleOpenJobDetailsModal(job);
                        setShowJobDetails(true);
                      }}
                      className={styles.smallbtn}
                    >
                      Open Job Post
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsList;
