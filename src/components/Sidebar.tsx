import React, { useEffect, useState } from "react";
import "../css.styles/SideBar.css";
import { FaSearch } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  pay: number;
  cash: boolean;
  venmo: boolean;
  cashApp: boolean;
  date: Date;
  employerID: string;
}

const categoryOptions: { [key: string]: string[] } = {
  Payment: ["$0-50", "$50-100", "$100-150", "More"],
  Location: ["USA", "Europe", "Asia", "Other"],
  PayWay: ["Cash", "Venmo", "CashApp"],
};

const Sidebar: React.FC<{
  onSearch: (query: string) => void;
  onFilter: (filters: { [category: string]: string[] }) => void;
}> = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[];
  }>({});

  // Updates the filter state dynamically
  useEffect(() => {
    onFilter(selectedOptions);
  }, [selectedOptions, onFilter]);

  const handleCheckboxChange = (category: string, option: string) => {
    setSelectedOptions((prev) => {
      const updatedCategory = prev[category] || [];

      return {
        ...prev,
        [category]: updatedCategory.includes(option)
          ? updatedCategory.filter((opt: string) => opt !== option) // Uncheck
          : [...updatedCategory, option], // Check
      };
    });
  };

  return (
    <aside className="sidebar">
      {/* Search Bar */}
      <div className="search-wrapper">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* All Category Checkboxes Shown by Default */}
      <div className="category-filters">
        {Object.entries(categoryOptions).map(([category, options]) => (
          <div key={category} className="CheckboxContainer">
            <h4 className="CheckboxTitle">{category}</h4>
            {options.map((option) => (
              <label key={option} className="CheckboxLabel">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions[category]?.includes(option) || false}
                  onChange={() => handleCheckboxChange(category, option)}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
