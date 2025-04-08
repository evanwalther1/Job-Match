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

const categoryOptions: { [key: string]: (string | number)[] } = {
  Payment: [0, 50, 100, 150],
  Location: ["USA", "Europe", "Asia", "Other"],
  PayWay: ["Cash", "Venmo", "CashApp"],
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
