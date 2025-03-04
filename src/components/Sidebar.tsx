import React, { useState } from "react";

const categoryOptions: { [key: string]: string[] } = {
  Payment: ["$0-50", "$50-100", "$100-150", "More"],
  Location: ["USA", "Europe", "Asia"],
  PayWay: ["Cash", "Venmo", "CashApp"],
};

const Sidebar: React.FC<{
  onSearch: (query: string) => void;
  onFilter: (category: string, selectedOptions: string[]) => void;
}> = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((opt) => opt !== option)
        : [...prevOptions, option]
    );
  };

  return (
    <aside className="Sidebar">
      <h3 className="Search&Filter">Search & Filter</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="SearchBar"
      />

      {/* Filter Dropdown */}
      <select
        value={category}
        onChange={(e) => {
          const selectedCategory = e.target.value;
          setCategory(selectedCategory);
          setSelectedOptions([]); // Reset checkboxes on category change
          onFilter(selectedCategory, []);
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

      {/* Dynamic Checkboxes Based on Selected Category */}
      {category && categoryOptions[category] && (
        <div className="CheckboxContainer">
          <h4 className="CheckboxTitle">{category} Options</h4>
          {categoryOptions[category].map((option) => (
            <label key={option} className="CheckboxLabel">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => {
                  handleCheckboxChange(option);
                  onFilter(category, selectedOptions);
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
