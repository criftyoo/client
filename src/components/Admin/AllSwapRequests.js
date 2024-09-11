import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSwaps, updateSwapStatus } from '../../redux/modules/admin';
import { cancelAllSwaps } from '../../redux/modules/swap';
import * as XLSX from 'xlsx';
import SelectFilter from '../common/SelectFilter'; 


const AllSwapRequests = () => {
  const dispatch = useDispatch();
  const swaps = useSelector((state) => state.admin.swaps.all);
  const loading = useSelector((state) => state.admin.loading.allSwaps);
  const error = useSelector((state) => state.admin.error);

  const [searchQuery, setSearchQuery] = useState('');
  const [requesterFilter, setRequesterFilter] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
  const [requesterScheduleFilter, setRequesterScheduleFilter] = useState('');
  const [recipientScheduleFilter, setRecipientScheduleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('');
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSwaps());
      } catch (err) {
        console.error('Error fetching swaps:', err);
      }
    };
    fetchData();
  }, [dispatch]);

  const getUniqueValues = useCallback((key) => {
    const values = swaps.map((swap) => {
      const keys = key.split('.');
      let value = swap;
      for (const k of keys) {
        value = value ? value[k] : 'N/A';
      }
      return value || 'N/A';
    });
    return [...new Set(values)];
  }, [swaps]);

  const uniqueRequesterUsernames = useMemo(() => getUniqueValues('requester.username'), [getUniqueValues]);
  const uniqueRecipientUsernames = useMemo(() => getUniqueValues('recipient.username'), [getUniqueValues]);
  const uniqueRequesterSchedules = useMemo(() => getUniqueValues('requesterSchedule.workingHours'), [getUniqueValues]);
  const uniqueRequesterWeeks = useMemo(() => getUniqueValues('requesterSchedule.week'), [getUniqueValues]);
  const uniqueRecipientSchedules = useMemo(() => getUniqueValues('recipientSchedule.workingHours'), [getUniqueValues]);
  const uniqueRecipientWeeks = useMemo(() => getUniqueValues('recipientSchedule.week'), [getUniqueValues]);
  const uniqueStatuses = useMemo(() => getUniqueValues('status'), [getUniqueValues]);
  const uniqueApprovals = useMemo(() => getUniqueValues('adminApproval'), [getUniqueValues]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAccept = async (id, requesterId, recipientId) => {
    try {
      await dispatch(updateSwapStatus(id, 'approved', 'Swap has been approved by the WFM', 'admin', 'approved'));
      await dispatch(cancelAllSwaps(requesterId, recipientId));
    } catch (err) {
      setActionError('Error approving swap');
      console.error('Error approving swap:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(updateSwapStatus(id, 'declined', 'Swap has been rejected by the WFM', 'admin', 'declined'));
    } catch (err) {
      setActionError('Error rejecting swap');
      console.error('Error rejecting swap:', err);
    }
  };

  const filteredSwaps = useMemo(() => {
    const searchQueryLower = searchQuery.toLowerCase();
    return swaps.filter((swap) => {
      const requesterSchedule = `${swap.requesterSchedule.workingHours} (Week ${swap.requesterSchedule.week})`;
      const recipientSchedule = `${swap.recipientSchedule.workingHours} (Week ${swap.recipientSchedule.week})`;

      return (
        swap.status !== 'pending' &&
        (swap.requester?.username?.toLowerCase().includes(searchQueryLower) ||
          swap.recipient?.username?.toLowerCase().includes(searchQueryLower) ||
          requesterSchedule.toLowerCase().includes(searchQueryLower) ||
          recipientSchedule.toLowerCase().includes(searchQueryLower) ||
          swap.status?.toLowerCase().includes(searchQueryLower) ||
          swap.adminApproval?.toLowerCase().includes(searchQueryLower)) &&
        (requesterFilter === '' || swap.requester?.username === requesterFilter) &&
        (recipientFilter === '' || swap.recipient?.username === recipientFilter) &&
        (requesterScheduleFilter === '' || requesterSchedule === requesterScheduleFilter) &&
        (recipientScheduleFilter === '' || recipientSchedule === recipientScheduleFilter) &&
        (statusFilter === '' || swap.status === statusFilter) &&
        (approvalFilter === '' || swap.adminApproval === approvalFilter)
      );
    });
  }, [swaps, searchQuery, requesterFilter, recipientFilter, requesterScheduleFilter, recipientScheduleFilter, statusFilter, approvalFilter]);

  const exportToExcel = () => {
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching swaps: {error}</div>;
  }

  return (
    <div className="main">
      <h2 className="form-title">Swap Requests</h2>
      <input
        type="text"
        placeholder="Search by username, working hours, off days, or week..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <button className="btn-primary" onClick={exportToExcel}>Download as Excel</button>
      {actionError && <div className="error">{actionError}</div>}
      <table>
        <thead>
          <tr>
            <th>
              Requester
              <SelectFilter value={requesterFilter} onChange={(e) => setRequesterFilter(e.target.value)} options={uniqueRequesterUsernames} />
            </th>
            <th>
              Recipient
              <SelectFilter value={recipientFilter} onChange={(e) => setRecipientFilter(e.target.value)} options={uniqueRecipientUsernames} />
            </th>
            <th>
              Requester Schedule
              <SelectFilter value={requesterScheduleFilter} onChange={(e) => setRequesterScheduleFilter(e.target.value)} options={uniqueRequesterSchedules} />
            </th>
            <th>
              Recipient Schedule
              <SelectFilter value={recipientScheduleFilter} onChange={(e) => setRecipientScheduleFilter(e.target.value)} options={uniqueRecipientSchedules} />
            </th>
            <th>
              Status
              <SelectFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={uniqueStatuses} />
            </th>
            <th>
              Approval
              <SelectFilter value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)} options={uniqueApprovals} />
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