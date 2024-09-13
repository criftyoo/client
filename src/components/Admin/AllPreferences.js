import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPreferences } from '../../redux/modules/preferences';
import * as XLSX from 'xlsx';
import usePersistedState from '../hooks/usePersistedState';
import FilterDropdown from '../common/FilterDropdown';

const AllPreferences = () => {
    const [preferences, setPreferences] = usePersistedState('preferences', []);
    const loading = useSelector((state) => state.preferences.loading);
    const error = useSelector((state) => state.preferences.error);
    const dispatch = useDispatch();

    const [filters, setFilters] = usePersistedState('filters', {
        username: '',
        preferredShift: '',
        preferredOffDays: '',
        week: ''
    });

    useEffect(() => {
        dispatch(getAllPreferences());
    }, [dispatch]);

    const preferencesFromStore = useSelector((state) => state.preferences.preferences);

    useEffect(() => {
        if (preferencesFromStore.length > 0) {
            setPreferences(preferencesFromStore);
        }
    }, [preferencesFromStore, setPreferences]);

    const getUniqueValues = useCallback((key) => {
        const values = Array.isArray(preferences) ? preferences.flatMap((preference) => {
            const keys = key.split('.');
            let value = preference;
            for (const k of keys) {
                value = value ? value[k] : 'N/A';
            }
            if (Array.isArray(value)) {
                return value;
            }
            return value || 'N/A';
        }) : [];
        return [...new Set(values)];
    }, [preferences]);

    const handleFilterChange = (filterName) => (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: e.target.value
        }));
    };

    const filteredPreferences = useMemo(() => {
        if (!Array.isArray(preferences)) return [];
        return preferences.filter((preference) => {
            const { user, preferredShift, preferredOffDays, week } = preference;
            const username = user?.username || 'N/A';
            const preferredOffDaysStr = Array.isArray(preferredOffDays) ? preferredOffDays.join(', ') : preferredOffDays || 'N/A';
            const weekStr = week || 'N/A';

            return (
                (filters.username === '' || username === filters.username) &&
                (filters.preferredShift === '' || preferredShift === filters.preferredShift) &&
                (filters.preferredOffDays === '' || preferredOffDaysStr.includes(filters.preferredOffDays)) &&
                (filters.week === '' || weekStr === filters.week)
            );
        });
    }, [preferences, filters]);

    const exportToExcel = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(filteredPreferences.map(preference => ({
                Username: preference.user.username,
                'Preferred Shift': preference.preferredShift,
                'Preferred Off Days': Array.isArray(preference.preferredOffDays) ? preference.preferredOffDays.join(', ') : preference.preferredOffDays || 'N/A',
                'Creation Date': new Date(preference.createdAt).toLocaleDateString(),
                Week: preference.week
            })));
            const workbook = XLSX.utils.book_new();
            const weeks = [...new Set(filteredPreferences.map(preference => preference.week))].join('-');
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Preferences');
            XLSX.writeFile(workbook, `Preferences-Weeks${weeks}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('An error occurred while exporting to Excel. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!preferences.length) return <p>No preferences found.</p>;

    return (
        <div className='main'>
            <h2 className='form-title'>Schedule Preferences</h2>
            <button className='btn-primary' onClick={exportToExcel}>Download as Excel</button>
            <table>
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
                            Preferred Shift
                            <FilterDropdown
                                value={filters.preferredShift}
                                onChange={handleFilterChange('preferredShift')}
                                options={getUniqueValues('preferredShift')}
                                ariaLabel="Filter by preferred shift"
                            />
                        </th>

                        <th>
                            Preferred Off Days
                            <FilterDropdown
                                value={filters.preferredOffDays}
                                onChange={handleFilterChange('preferredOffDays')}
                                options={getUniqueValues('preferredOffDays')}
                                ariaLabel="Filter by preferred off days"
                            />
                        </th>
                        <th>
                            Creation Date
                            <FilterDropdown
                                value={filters.createdAt}
                                onChange={handleFilterChange('createdAt')}
                                options={getUniqueValues('createdAt')}
                                ariaLabel="Filter by creation date"
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
                    {filteredPreferences.map((preference) => (
                        <tr key={preference._id}>
                            <td>{preference.user.username}</td>
                            <td>{preference.preferredShift}</td>
                            <td>{Array.isArray(preference.preferredOffDays) ? preference.preferredOffDays.join(', ') : preference.preferredOffDays || 'N/A'}</td>
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