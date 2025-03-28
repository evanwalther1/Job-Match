import React, { useEffect, useState } from "react";
import "../css.styles/SideBar.css";
import { FaSearch } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import JobsList from "./JobsList";

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

interface SidebarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { [key: string]: string[] }) => void;
}

const categoryOptions: { [key: string]: (string | number)[] } = {
  Payment: [0, 50, 100, 150],
  Location: ["USA", "Europe", "Asia", "Other"],
  PayWay: ["Cash", "Venmo", "CashApp"],
};

const Sidebar: React.FC<SidebarProps> = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: (string | number)[];
  }>({});

  useEffect(() => {
    const formattedFilters = Object.fromEntries(
      Object.entries(selectedOptions).map(([key, options]) => [
        key,
        options.map((opt) => opt.toString().toLowerCase()),
      ])
    );
    onFilter(formattedFilters);
  }, [selectedOptions, onFilter]);

  const handleCheckboxChange = (category: string, option: string | number) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[category] || [];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];
      return { ...prev, [category]: newOptions };
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

      {/* Category Filters */}
      <div className="category-filters">
        {Object.entries(categoryOptions).map(([category, options]) => (
          <div key={category} className="CheckboxContainer">
            <h4 className="CheckboxTitle">{category}</h4>
            {options.map((option) => (
              <label key={option.toString()} className="CheckboxLabel">
                <input
                  type="checkbox"
                  value={option.toString()}
                  checked={selectedOptions[category]?.includes(option) || false}
                  onChange={() => handleCheckboxChange(category, option)}
                />
                {typeof option === "number" ? `$${option}` : option}
              </label>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
function setSelectedFilters(filters: {
  [category: string]: (string | number)[];
}) {
  throw new Error("Function not implemented.");
}
