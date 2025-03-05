import { useEffect } from "react";
import Layout from "../components/Layout";
import MainContent from "../components/MainContent";
import Navbar from "../components/Navbar";

const JobSearch = () => {
  useEffect(() => {
    console.log("JobSearch page mounted!");
  }, []); // Empty dependency array ensures this only runs once on page load
  return (
    <Layout>
      <MainContent searchQuery={""} filterCategories={[]} />
    </Layout>
  );
};

export default JobSearch;
