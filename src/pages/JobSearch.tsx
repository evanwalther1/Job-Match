import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import MainContent from "../components/MainContent";
import JobPostForm from "../components/JobPostForm";

const JobSearch = () => {
  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    padding: "10px",
    zIndex: 1000,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const OVERLAY_STYLES: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1000,
  };

  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);

  useEffect(() => {
    if (isCreateJobModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCreateJobModalOpen]);

  const handleOpenCreateJobModal = () => {
    setIsCreateJobModalOpen(true);
  };

  const handleCloseCreateJobModal = () => {
    setIsCreateJobModalOpen(false);
  };

  return (
    <>
      {/* Popup Modal */}
      {isCreateJobModalOpen && (
        <div style={OVERLAY_STYLES} onClick={handleCloseCreateJobModal}>
          <div style={MODAL_STYLES} onClick={(e) => e.stopPropagation()}>
            <JobPostForm onClose={handleCloseCreateJobModal} />
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <Layout>
        <MainContent
          onCreateNewJob={handleOpenCreateJobModal}
          searchQuery={""}
          filterCategories={[]}
        />
      </Layout>
    </>
  );
};

export default JobSearch;
