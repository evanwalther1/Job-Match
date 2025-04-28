import React, { useEffect, useState } from "react";
import "../css.styles/SideBar.css";
import { FaSearch } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Job } from "../FirebaseServices";

interface SidebarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { [key: string]: string[] }) => void;
  onCreateNewJob: () => void;
}

const categoryOptions: {
  [key: string]: { value: number | string; label: string }[];
} = {
  Payment: [
    { value: 0, label: "$0 - $50" },
    { value: 50, label: "$50 - $100" },
    { value: 100, label: "$100 - $150" },
    { value: 150, label: "$150+" },
  ],
  Location: [
    { value: 0, label: "< 1 mile" },
    { value: 1, label: "< 2 miles" },
    { value: 2, label: "< 5 miles" },
    { value: 5, label: "> 5 miles" },
  ],
  PayWay: [
    { value: "Cash", label: "Cash" },
    { value: "Venmo", label: "Venmo" },
    { value: "CashApp", label: "CashApp" },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({
  onSearch,
  onFilter,
  onCreateNewJob,
}) => {
  const [query, setQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: (string | number)[];
  }>({});

  useEffect(() => {
    const formattedFilters = Object.fromEntries(
      Object.entries(selectedOptions)
        .filter(([_, options]) => options.length > 0)
        .map(([key, options]) => [
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

      <div className="primary-button">
        <button onClick={onCreateNewJob} className="sidebar-button">
          Create New Job
        </button>
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
                  value={option.value.toString()}
                  checked={
                    selectedOptions[category]?.includes(option.value) || false
                  }
                  onChange={() => handleCheckboxChange(category, option.value)}
                />
                {option.label}
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
