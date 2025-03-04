import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar
          onSearch={setSearchQuery}
          onFilter={(filters) => {
            const category = Object.keys(filters)[0]; // Get the first category
            setFilterCategory(category);
            setSelectedFilters(filters[category] || []);
          }}
        />

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
