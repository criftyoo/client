import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../../redux/modules/adminSlice';
import * as XLSX from 'xlsx';

const AllSchedules = () => {
  const dispatch = useDispatch();
  const { schedules = [], loading, error } = useSelector((state) => state.admin); // Default to an empty array
  const [searchQuery, setSearchQuery] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [workingHoursFilter, setWorkingHoursFilter] = useState('');
  const [offDaysFilter, setOffDaysFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');

  useEffect(() => {
    dispatch(fetchSchedules()); // Fetch all schedules when the component mounts
  }, [dispatch]);

  const getUniqueValues = useMemo(() => (key) => {
    const values = schedules.map((schedule) => {
      const keys = key.split('.');
      let value = schedule;
      for (const k of keys) {
        value = value ? value[k] : 'N/A';
      }
      return value || 'N/A';
    });
    return [...new Set(values)];
  }, [schedules]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSchedules = useMemo(() => schedules.filter((schedule) => {
    const username = schedule.user?.username || 'N/A';
    const workingHours = schedule.workingHours || 'N/A';
    const offDays = schedule.offDays?.join(', ') || 'N/A';
    const week = schedule.week || 'N/A';

    return (
      (username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workingHours.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offDays.toLowerCase().includes(searchQuery.toLowerCase()) ||
        week.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (usernameFilter === '' || username === usernameFilter) &&
      (workingHoursFilter === '' || workingHours === workingHoursFilter) &&
      (offDaysFilter === '' || offDays === offDaysFilter) &&
      (weekFilter === '' || week === weekFilter)
    );
  }), [schedules, searchQuery, usernameFilter, workingHoursFilter, offDaysFilter, weekFilter]);

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
    return <p className="error-message">An error occurred: {error}</p>;
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
      {filteredSchedules.length > 0 ? (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>
                Username
                <select
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                  className="filter-dropdown"
                  aria-label="Filter by username"
                >
                  <option value="">All</option>
                  {getUniqueValues('user.username').map((value, index) => (
                    <option key={`${value}-${index}`} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                Working Hours
                <select
                  value={workingHoursFilter}
                  onChange={(e) => setWorkingHoursFilter(e.target.value)}
                  className="filter-dropdown"
                  aria-label="Filter by working hours"
                >
                  <option value="">All</option>
                  {getUniqueValues('workingHours').map((value, index) => (
                    <option key={`${value}-${index}`} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                Off Days
                <select
                  value={offDaysFilter}
                  onChange={(e) => setOffDaysFilter(e.target.value)}
                  className="filter-dropdown"
                  aria-label="Filter by off days"
                >
                  <option value="">All</option>
                  {getUniqueValues('offDays').map((value, index) => (
                    <option key={`${value}-${index}`} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                Week
                <select
                  value={weekFilter}
                  onChange={(e) => setWeekFilter(e.target.value)}
                  className="filter-dropdown"
                  aria-label="Filter by week"
                >
                  <option value="">All</option>
                  {getUniqueValues('week').map((value, index) => (
                    <option key={`${value}-${index}`} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.user?.username || 'N/A'}</td>
                <td>{schedule.workingHours || 'N/A'}</td>
                <td>{schedule.offDays?.join(', ') || 'N/A'}</td>
                <td>{schedule.week || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedules found.</p>
      )}
    </div>
  );
};

export default AllSchedules;