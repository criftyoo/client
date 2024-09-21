import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSwaps, updateSwapStatus } from '../../redux/modules/admin';
import { cancelAllSwaps } from '../../redux/modules/swap';
import * as XLSX from 'xlsx';
import usePersistedState from '../hooks/usePersistedState'; // Import the custom hook
import FilterDropdown from '../common/FilterDropdown'; // Import the FilterDropdown component

const AllSwapRequests = () => {
  const dispatch = useDispatch();
  const swaps = useSelector((state) => state.admin.swaps.all || []); // Ensure initial state is an array
  const loading = useSelector((state) => state.admin.loading.allSwaps);
  const error = useSelector((state) => state.admin.error);

  const [filters, setFilters] = usePersistedState('filters', {
    requester: '',
    recipient: '',
    status: '',
    adminApproval: ''
  });
  const [actionError, setActionError] = usePersistedState('actionError', null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSwaps());
      } catch (err) {
        console.error('Error fetching swaps:', err);
      }
    };
    fetchData();
  }, [dispatch]); // Empty dependency array ensures this runs on mount

  // Debugging: Log the swaps array
  console.log('Swaps:', swaps);

  const handleFilterChange = useCallback((filterName) => (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: e.target.value
    }));
    console.log(`Filter ${filterName} changed to:`, e.target.value); // Debugging statement
  }, [setFilters]);

  const getUniqueValues = useCallback((key) => {
    const values = swaps.flatMap((swap) => {
      const keys = key.split('.');
      let value = swap;
      for (const k of keys) {
        value = value ? value[k] : 'N/A';
      }
      return Array.isArray(value) ? value : value || 'N/A';
    });
    return [...new Set(values)];
  }, [swaps]);

  const handleAccept = async (id, requesterId, recipientId) => {
    try {
      await dispatch(updateSwapStatus(id, 'approved', 'Swap has been approved by the WFM', 'admin', 'approved'));
      await dispatch(cancelAllSwaps(requesterId, recipientId));
      dispatch(fetchSwaps());
    } catch (err) {
      setActionError('Error approving swap');
      console.error('Error approving swap:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(updateSwapStatus(id, 'declined', 'Swap has been rejected by the WFM', 'admin', 'declined'));
      dispatch(fetchSwaps());
    } catch (err) {
      setActionError('Error rejecting swap');
      console.error('Error rejecting swap:', err);
    }
  };

  const filteredSwaps = useMemo(() => {
    console.log('Filtering swaps with filters:', filters); // Debugging statement
    try {
      return swaps.filter((swap) => {
        const requester = swap.requester?.username || 'N/A';
        const recipient = swap.recipient?.username || 'N/A';
        const status = swap.status || 'N/A';
        const adminApproval = swap.adminApproval || 'N/A';

        return (
          (filters.requester === '' || requester === filters.requester) &&
          (filters.recipient === '' || recipient === filters.recipient) &&
          (filters.status === '' || status === filters.status) &&
          (filters.adminApproval === '' || adminApproval === filters.adminApproval)
        );
      });
    } catch (error) {
      console.error('Error filtering swaps:', error);
      return [];
    }
  }, [swaps, filters]);

  const exportToExcel = useCallback(() => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(filteredSwaps.map(swap => ({
        Requester: swap.requester?.username || 'N/A',
        Recipient: swap.recipient?.username || 'N/A',
        'Requester Schedule': `${swap.requesterSchedule.workingHours} (Week ${swap.requesterSchedule.week})` || 'N/A',
        'Recipient Schedule': `${swap.recipientSchedule.workingHours} (Week ${swap.recipientSchedule.week})` || 'N/A',
        Status: swap.status || 'N/A',
        Approval: swap.adminApproval || 'N/A'
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Swaps');
      XLSX.writeFile(workbook, 'FilteredSwaps.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('An error occurred while exporting to Excel. Please try again.');
    }
  }, [filteredSwaps]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching swaps: {JSON.stringify(error)}</div>; // Convert error object to string
  }

  return (
    <div className="main">
      <h2 className="form-title">Swap Requests</h2>
      <button className="btn-primary" onClick={exportToExcel}>Download as Excel</button>
      <table>
        <thead>
          <tr>
            <th>
              Requester
              <FilterDropdown
                value={filters.requester}
                onChange={handleFilterChange('requester')}
                options={getUniqueValues('requester.username')}
                ariaLabel="Filter by requester"
              />
            </th>
            <th>
              Recipient
              <FilterDropdown
                value={filters.recipient}
                onChange={handleFilterChange('recipient')}
                options={getUniqueValues('recipient.username')}
                ariaLabel="Filter by recipient"
              />
            </th>
            <th>Requester Schedule</th>
            <th>Recipient Schedule</th>
            <th>
              Status
              <FilterDropdown
                value={filters.status}
                onChange={handleFilterChange('status')}
                options={getUniqueValues('status')}
                ariaLabel="Filter by status"
              />
            </th>
            <th>
              Approval
              <FilterDropdown
                value={filters.adminApproval}
                onChange={handleFilterChange('adminApproval')}
                options={getUniqueValues('adminApproval')}
                ariaLabel="Filter by approval"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSwaps.length > 0 ? (
            filteredSwaps.map((swap) => (
              <tr key={swap._id}>
                <td>{swap.requester.username}</td>
                <td>{swap.recipient.username}</td>
                <td>{`${swap.requesterSchedule.workingHours} (Week ${swap.requesterSchedule.week})`}</td>
                <td>{`${swap.recipientSchedule.workingHours} (Week ${swap.recipientSchedule.week})`}</td>
                <td>{swap.status}</td>
                <td>
                  {swap.status === 'pending' ? (
                    <>
                      <button onClick={() => handleAccept(swap._id, swap.requester._id, swap.recipient._id)}>Accept</button>
                      <button onClick={() => handleReject(swap._id)}>Reject</button>
                    </>
                  ) : (
                    <span>{swap.adminApproval}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No swaps found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllSwapRequests;