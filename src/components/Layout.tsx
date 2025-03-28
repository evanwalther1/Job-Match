import React, { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import JobsList from "./JobsList";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  const handleFilterChange = useCallback(
    (filters: { [key: string]: string[] }) => {
      console.log("Filters received in Layout:", filters); // 调试
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        ...filters,
      }));
    },
    []
  );

  return (
    <div className="h-screen flex flex-col relative">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar onSearch={setSearchQuery} onFilter={handleFilterChange} />
        <main className="flex-1 p-5">
          <JobsList
            searchQuery={searchQuery}
            selectedFilters={selectedFilters}
          />
        </main>
      </div>
    </div>
  );
};

export default Layout;
