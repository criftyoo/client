import React from 'react';

const SearchInput = ({ searchQuery, setSearchQuery, placeholder }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleSearch}
      className="search-input"
      aria-label={placeholder}
    />
  );
};

export default SearchInput;