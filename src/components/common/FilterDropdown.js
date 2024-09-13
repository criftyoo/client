import React from 'react';

const FilterDropdown = ({ value, onChange, options, ariaLabel }) => (
  <select value={value} onChange={onChange} className="filter-dropdown" aria-label={ariaLabel}>
    <option value="">All</option>
    {options.map((option, index) => (
      <option key={`${option}-${index}`} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default FilterDropdown;