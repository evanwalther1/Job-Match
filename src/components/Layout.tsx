import React, { useState, useCallback } from "react";
// Import Sidebar and MainContent here
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Memoize onFilter to prevent unnecessary re-renders
  const handleFilterChange = useCallback(
    (filters: { [category: string]: string[] }) => {
      // Logic to handle the filter change
      const category = Object.keys(filters)[0]; // Get the first category
      setFilterCategory(category);
      setSelectedFilters(filters[category] || []);
    },
    []
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar onSearch={setSearchQuery} onFilter={handleFilterChange} />

        {/* Main Content */}
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
