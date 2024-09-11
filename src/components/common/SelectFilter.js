import React from 'react';

const SelectFilter = ({ value, onChange, options }) => (
    <select value={value} onChange={onChange} className="small-select">
      <option value="">All</option>
      {options.map((option, index) => (
        <option key={`${option}-${index}`} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

export default SelectFilter;