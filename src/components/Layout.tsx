import React, { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Navbar from "./Navbar";
import JobPostForm from "./JobPostForm";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = useCallback(
    (filters: { [category: string]: string[] }) => {
      const category = Object.keys(filters)[0];
      setFilterCategory(category);
      setSelectedFilters(filters[category] || []);
    },
    []
  );

  return (
    <div className="h-screen flex flex-col relative">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar onSearch={setSearchQuery} onFilter={handleFilterChange} />
        <main className="flex-1 p-5">
          {React.cloneElement(children as React.ReactElement, {
            searchQuery,
            filterCategory,
            selectedFilters,
          })}
        </main>
      </div>
    </div>
  );
};

export default Layout;
