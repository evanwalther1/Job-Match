import React, { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { MainContent } from "./MainContent";
import { ErrorBoundary } from "react-error-boundary";

const Layout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    Payment: string[];
    Location: string[];
    PayWay: string[];
  }>({
    Payment: [],
    Location: [],
    PayWay: [],
  });

  const handleFilterChange = useCallback(
    (filters: { [key: string]: string[] }) => {
      setSelectedFilters((prev) => ({
        Payment: filters.Payment ?? [],
        Location: filters.Location ?? [],
        PayWay: filters.PayWay ?? [],
      }));
    },
    []
  );

  return (
    <div className="h-screen flex flex-col relative">
      <Navbar />

      <div
        className="flex-1 flex min-h-0"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <Sidebar onSearch={setSearchQuery} onFilter={handleFilterChange} />

        <main className="flex-1 p-5 overflow-auto">
          <MainContent
            searchQuery={searchQuery}
            selectedFilters={selectedFilters}
            filterCategories={[]}
            onCreateNewJob={() => console.log("Create Job")}
          />
        </main>
      </div>
    </div>
  );
};

export default Layout;
