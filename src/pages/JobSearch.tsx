import Layout from "../components/Layout";
import MainContent from "../components/MainConent";
import Navbar from "../components/Navbar";

const JobSearch = () => {
  return (
    <Layout>
      <MainContent searchQuery={""} filterCategories={[]} />
    </Layout>
  );
};

export default JobSearch;
