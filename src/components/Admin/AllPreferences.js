import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
<<<<<<< HEAD
import { getAllPreferences } from '../../redux/modules/preferences';
import LoadingMessage from '../common/LoadingMessage';
import ErrorMessage from '../common/ErrorMessage';
import useFetchData from '../hooks/useFetchData';
import exportToExcel from '../common/exportToExcel';
import SelectFilter from '../common/SelectFilter';
import SearchInput from '../common/SearchInput';
=======
import { getAllPreferences } from '../../redux/modules/preferencesSlice';
import * as XLSX from 'xlsx';
>>>>>>> 1408cdf67de0678b134fd1e573047456d3e59e43

const AllPreferences = () => {
    const { data: preferences, loading, error } = useFetchData(getAllPreferences, (state) => state.preferences.preferences);

    const [searchQuery, setSearchQuery] = useState('');
    const [usernameFilter, setUsernameFilter] = useState('');
    const [preferredShiftFilter, setPreferredShiftFilter] = useState('');
    const [preferredOffDaysFilter, setPreferredOffDaysFilter] = useState('');
    const [weekFilter, setWeekFilter] = useState('');

    const getUniqueValues = useCallback((key) => {
        const values = preferences.map((preference) => {
            const keys = key.split('.');
            let value = preference;
            for (const k of keys) {
                value = value ? value[k] : 'N/A';
            }
            return value || 'N/A';
        });
        return [...new Set(values)];
    }, [preferences]);

    const filteredPreferences = useMemo(() => preferences.filter((preference) => {
        const username = preference.user?.username || 'N/A';
        const preferredShift = preference.preferredShift || 'N/A';
        const preferredOffDays = preference.preferredOffDays?.join(', ') || 'N/A';
        const week = preference.week || 'N/A';

        return (
            (username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                preferredShift.toLowerCase().includes(searchQuery.toLowerCase()) ||
                preferredOffDays.toLowerCase().includes(searchQuery.toLowerCase()) ||
                week.toString().includes(searchQuery.toLowerCase())) &&
            (usernameFilter === '' || username === usernameFilter) &&
            (preferredShiftFilter === '' || preferredShift === preferredShiftFilter) &&
            (preferredOffDaysFilter === '' || preferredOffDays === preferredOffDaysFilter) &&
            (weekFilter === '' || week === weekFilter)
        );
    }), [preferences, searchQuery, usernameFilter, preferredShiftFilter, preferredOffDaysFilter, weekFilter]);

    const exportDataToExcel = () => {
        try {
            const formattedData = filteredPreferences.map(preference => ({
                Username: preference.user.username,
                'Preferred Shift': preference.preferredShift,
                'Preferred Off Days': preference.preferredOffDays.join(', '),
                'Creation Date': new Date(preference.createdAt).toLocaleDateString(),
                Week: preference.week
            }));
            const weeks = [...new Set(filteredPreferences.map(preference => preference.week))].join('-');
            exportToExcel(formattedData, `Preferences-Weeks${weeks}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('An error occurred while exporting to Excel. Please try again.');
        }
    };

    if (loading) return <LoadingMessage message="Loading preferences..." />;
    if (error) return <ErrorMessage message={`Error: ${error}`} />;
    if (!preferences.length) return <p>No preferences found.</p>;

    return (
        <div className='main'>
            <h2 className='form-title'>Schedule Preferences</h2>
            <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search by username, preferred shift, preferred off days, or week..."
            />
            <button className='btn-primary' onClick={exportDataToExcel}>Download as Excel</button>
            <table>
                <thead>
                    <tr>
                        <th>
                            Username
                            <SelectFilter
                                value={usernameFilter}
                                onChange={(e) => setUsernameFilter(e.target.value)}
                                options={getUniqueValues('user.username')}
                            />
                        </th>
                        <th>
                            Preferred Shift
                            <SelectFilter
                                value={preferredShiftFilter}
                                onChange={(e) => setPreferredShiftFilter(e.target.value)}
                                options={getUniqueValues('preferredShift')}
                            />
                        </th>
                        <th>
                            Preferred Off Days
                            <SelectFilter
                                value={preferredOffDaysFilter}
                                onChange={(e) => setPreferredOffDaysFilter(e.target.value)}
                                options={getUniqueValues('preferredOffDays')}
                            />
                        </th>
                        <th>Creation Date</th>
                        <th>
                            Week
                            <SelectFilter
                                value={weekFilter}
                                onChange={(e) => setWeekFilter(e.target.value)}
                                options={getUniqueValues('week')}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPreferences.map((preference) => (
                        <tr key={preference._id}>
                            <td>{preference.user.username}</td>
                            <td>{preference.preferredShift}</td>
                            <td>{preference.preferredOffDays.join(', ')}</td>
                            <td>{new Date(preference.createdAt).toLocaleDateString()}</td>
                            <td>{preference.week}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllPreferences;