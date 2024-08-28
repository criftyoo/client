import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPreferences } from '../../redux/modules/preferences';
import * as XLSX from 'xlsx';

const AllPreferences = () => {
    const preferences = useSelector((state) => state.preferences.preferences);
    const loading = useSelector((state) => state.preferences.loading);
    const error = useSelector((state) => state.preferences.error);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPreferences());
    }, [dispatch]);

    const exportToExcel = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(preferences.map(preference => ({
                Username: preference.user.username,
                'Preferred Shift': preference.preferredShift,
                'Preferred Off Days': preference.preferredOffDays.join(', '),
                'Creation Date': new Date(preference.createdAt).toLocaleDateString(),
                Week: preference.week
            })));
            const workbook = XLSX.utils.book_new();
            const weeks = [...new Set(preferences.map(preference => preference.week))].join('-');
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
        <div>
            <h1>All Preferences</h1>
            <button onClick={exportToExcel}>Download as Excel</button>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Preferred Shift</th>
                        <th>Preferred Off Days</th>
                        <th>Creation Date</th>
                        <th>Week</th>
                    </tr>
                </thead>
                <tbody>
                    {preferences.map((preference) => (
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