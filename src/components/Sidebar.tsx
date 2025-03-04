import React, { useEffect, useState } from "react";
import "../css.styles/SideBar.css";
import { FaSearch } from "react-icons/fa";

const categoryOptions: { [key: string]: string[] } = {
  Payment: ["$0-50", "$50-100", "$100-150", "More"],
  Location: ["USA", "Europe", "Asia", "Other"],
  PayWay: ["Cash", "Venmo", "CashApp"],
};

const Sidebar: React.FC<{
  onSearch: (query: string) => void;
  onFilter: (category: string, selectedOptions: string[]) => void;
}> = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (category) {
      onFilter(category, selectedOptions);
    }
  }, [category, selectedOptions, onFilter]);

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((opt) => opt !== option)
        : [...prevOptions, option]
    );
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

      {/* Filter Dropdown */}
      <div className="category-filters">
        <select
          value={category}
          onChange={(e) => {
            const selectedCategory = e.target.value;
            setCategory(selectedCategory);
            setSelectedOptions([]); // Reset checkboxes on category change
          }}
          className="Filter"
        >
          <option value="">All Categories</option>
          {Object.keys(categoryOptions).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* ✅ Dynamic Checkboxes Based on Selected Category */}
        {category && categoryOptions[category] && (
          <div className="CheckboxContainer">
            <h4 className="CheckboxTitle">{category} Options</h4>
            {categoryOptions[category].map((option) => (
              <label key={option} className="CheckboxLabel">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
