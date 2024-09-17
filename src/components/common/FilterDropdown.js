import React from 'react';

const FilterDropdown = ({ value, onChange, options, ariaLabel }) => {
  console.log('FilterDropdown options:', options); // Debugging statement
  console.log('FilterDropdown value:', value); // Debugging statement

  return (
    <select value={value} onChange={onChange} className="filter-dropdown" aria-label={ariaLabel}>
      <option value="">All</option>
      {options.map((option, index) => (
        <option key={`${option}-${index}`} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;