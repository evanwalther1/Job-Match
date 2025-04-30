import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { MainContent } from "./MainContent";
import JobPostForm from "./JobPostForm"; // Make sure the import path is correct

const Layout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Payment: [],
    Location: [],
    PayWay: [],
    Date: [],
  });

  // Add the modal state and styles from JobSearch
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);

  // Add the modal styles from JobSearch
  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    padding: "50px",
    zIndex: 9999,
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
    zIndex: 9998,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // Add the useEffect for body overflow
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

  // Add the handlers for opening/closing the modal
  const handleOpenCreateJobModal = () => {
    setIsCreateJobModalOpen(true);
  };

  const handleCloseCreateJobModal = () => {
    setIsCreateJobModalOpen(false);
  };

  // Add the portal rendering function
  const renderPortal = () => {
    if (!isCreateJobModalOpen) return null;
    const portalElement = document.getElementById("portal");
    if (!portalElement) return null;

    return ReactDOM.createPortal(
      <div style={OVERLAY_STYLES} onClick={handleCloseCreateJobModal}>
        <div style={MODAL_STYLES} onClick={(e) => e.stopPropagation()}>
          <JobPostForm onClose={handleCloseCreateJobModal} />
        </div>
      </div>,
      portalElement
    );
  };

  const handleFilterChange = useCallback(
    (filters: { [key: string]: string[] }) => {
      setSelectedFilters((prev) => ({
        Payment: filters.Payment ?? [],
        Location: filters.Location ?? [],
        PayWay: filters.PayWay ?? [],
        Date: filters.Date ?? [],
      }));
    },
    []
  );

  return (
    <div className="h-screen flex flex-col relative">
      {renderPortal()} {/* Add the portal render here */}
      <Navbar />
      <div
        className="flex-1 flex min-h-0"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <Sidebar
          onSearch={setSearchQuery}
          onFilter={handleFilterChange}
          onCreateNewJob={handleOpenCreateJobModal}
        />
        <main className="flex-1 p-5 overflow-auto">
          <MainContent
            searchQuery={searchQuery}
            selectedFilters={selectedFilters}
            filterCategories={[]}
          />
        </main>
      </div>
    </div>
  );
};

export default Layout;
