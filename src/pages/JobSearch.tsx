import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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
    padding: "50px", // Increased padding for visibility
    zIndex: 9999, // Very high z-index to ensure it's on top
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
    zIndex: 9998, // Slightly lower than modal, but still very high
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

  // Render the portal first, outside of the main return
  const renderPortal = () => {
    if (!isCreateJobModalOpen) return null;

    return ReactDOM.createPortal(
      <div style={OVERLAY_STYLES} onClick={handleCloseCreateJobModal}>
        <div style={MODAL_STYLES} onClick={(e) => e.stopPropagation()}>
          <JobPostForm onClose={handleCloseCreateJobModal} />
        </div>
      </div>,
      document.getElementById("portal")!
    );
  };

  return (
    <>
      {renderPortal()}
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
