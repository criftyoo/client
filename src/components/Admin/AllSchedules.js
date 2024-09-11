import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD
import { fetchSchedules } from '../../redux/modules/admin';
import SelectFilter from '../common/SelectFilter';
import LoadingMessage from '../common/LoadingMessage';
import ErrorMessage from '../common/ErrorMessage';
import exportToExcel from '../common/exportToExcel';
import SearchInput from '../common/SearchInput';
=======
import { fetchSchedules } from '../../redux/modules/adminSlice';
import * as XLSX from 'xlsx';
>>>>>>> 1408cdf67de0678b134fd1e573047456d3e59e43

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

  const getUniqueValues = useCallback((key) => {
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

  const filteredSchedules = useMemo(() => schedules.filter((schedule) => {
    const username = schedule.user.username || 'N/A';
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

  if (loading.schedules) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="main">
      <h2 className="form-title">Schedules History</h2>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by username, working hours, off days, or week..."
      />
      <button className="btn-primary" onClick={() => exportToExcel(filteredSchedules)}>Download as Excel</button>
      <table>
        <thead>
          <tr>
            <th>
              Username
              <SelectFilter
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                options={getUniqueValues('user.username')}
                ariaLabel="Filter by username"
              />
            </th>
            <th>
              Working Hours
              <SelectFilter
                value={workingHoursFilter}
                onChange={(e) => setWorkingHoursFilter(e.target.value)}
                options={getUniqueValues('workingHours')}
                ariaLabel="Filter by working hours"
              />
            </th>
            <th>
              Off Days
              <SelectFilter
                value={offDaysFilter}
                onChange={(e) => setOffDaysFilter(e.target.value)}
                options={getUniqueValues('offDays')}
                ariaLabel="Filter by off days"
              />
            </th>
            <th>
              Week
              <SelectFilter
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
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
              <td colSpan="4" className="no-schedules-message">No schedules found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllSchedules;