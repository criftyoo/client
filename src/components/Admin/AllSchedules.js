import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../../redux/modules/admin';
import * as XLSX from 'xlsx';

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

const AllSchedules = () => {
  const dispatch = useDispatch();
  const { schedules = [], loading, error } = useSelector((state) => state.admin); // Default to an empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    username: '',
    workingHours: '',
    offDays: '',
    week: ''
  });

  useEffect(() => {
    dispatch(fetchSchedules()); // Fetch all schedules when the component mounts
  }, [dispatch]);

  const getUniqueValues = useCallback((key) => {
    const values = Array.isArray(schedules) ? schedules.map((schedule) => {
      const keys = key.split('.');
      let value = schedule;
      for (const k of keys) {
        value = value ? value[k] : 'N/A';
      }
      return value || 'N/A';
    }) : [];
    return [...new Set(values)];
  }, [schedules]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterName) => (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: e.target.value
    }));
  };

  const filteredSchedules = useMemo(() => {
    if (!Array.isArray(schedules)) return [];
    return schedules.filter((schedule) => {
      const { user, workingHours, offDays, week } = schedule;
      const username = user?.username || 'N/A';
      const offDaysStr = offDays?.join(', ') || 'N/A';
      const weekStr = week || 'N/A';

      return (
        (username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offDaysStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          weekStr.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filters.username === '' || username === filters.username) &&
        (filters.workingHours === '' || workingHours === filters.workingHours) &&
        (filters.offDays === '' || offDaysStr === filters.offDays) &&
        (filters.week === '' || weekStr === filters.week)
      );
    });
  }, [schedules, searchQuery, filters]);

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredSchedules.map(schedule => ({
        Username: schedule.user?.username || 'N/A',
        'Working Hours': schedule.workingHours || 'N/A',
        'Off Days': schedule.offDays?.join(', ') || 'N/A',
        Week: schedule.week || 'N/A'
      })));
      const workbook = XLSX.utils.book_new();
      const weeks = [...new Set(filteredSchedules.map(schedule => schedule.week || 'N/A'))].join('-');
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedules');
      XLSX.writeFile(workbook, `schedules-Weeks${weeks}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('An error occurred while exporting to Excel. Please try again.');
    }
  };

  if (loading.schedules) {
    return <p className="loading-message">Loading...</p>;
  }

  if (error) {
    return <p className="error-message">An error occurred: {JSON.stringify(error)}</p>; // Convert error object to string
  }

  return (
    <div className="main">
      <h2 className="form-title">Schedules History</h2>
      <input
        type="text"
        placeholder="Search by username, working hours, off days, or week..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
        aria-label="Search schedules"
      />
      <button className="btn-primary" onClick={exportToExcel}>Download as Excel</button>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>
              Username
              <FilterDropdown
                value={filters.username}
                onChange={handleFilterChange('username')}
                options={getUniqueValues('user.username')}
                ariaLabel="Filter by username"
              />
            </th>
            <th>
              Working Hours
              <FilterDropdown
                value={filters.workingHours}
                onChange={handleFilterChange('workingHours')}
                options={getUniqueValues('workingHours')}
                ariaLabel="Filter by working hours"
              />
            </th>
            <th>
              Off Days
              <FilterDropdown
                value={filters.offDays}
                onChange={handleFilterChange('offDays')}
                options={getUniqueValues('offDays')}
                ariaLabel="Filter by off days"
              />
            </th>
            <th>
              Week
              <FilterDropdown
                value={filters.week}
                onChange={handleFilterChange('week')}
                options={getUniqueValues('week')}
                ariaLabel="Filter by week"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.user?.username || 'N/A'}</td>
                <td>{schedule.workingHours || 'N/A'}</td>
                <td>{schedule.offDays?.join(', ') || 'N/A'}</td>
                <td>{schedule.week || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No schedules found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllSchedules;