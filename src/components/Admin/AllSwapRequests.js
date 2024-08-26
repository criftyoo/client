import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSwaps, updateSwapStatus } from '../../redux/modules/admin';

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
  const [updatedSwaps, setUpdatedSwaps] = useState([]);

  useEffect(() => {
    dispatch(fetchSwaps());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedSwaps(swaps);
  }, [swaps]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching swaps: {error}</div>;
  }

  const handleAccept = (id) => {
    dispatch(updateSwapStatus(id, 'approved', 'Swap has been approved by the WFM', 'admin', 'accepted'));
    setUpdatedSwaps((prevSwaps) =>
      prevSwaps.map((swap) =>
        swap._id === id ? { ...swap, status: 'accepted', adminApproval: 'accepted' } : swap
      )
    );
  };

  const handleReject = (id) => {
    dispatch(updateSwapStatus(id, 'declined', 'Swap has been rejected by the WFM', 'admin', 'rejected'));
    setUpdatedSwaps((prevSwaps) =>
      prevSwaps.map((swap) =>
        swap._id === id ? { ...swap, status: 'rejected', adminApproval: 'rejected' } : swap
      )
    );
  };

  const searchQueryLower = searchQuery.toLowerCase();

  const filteredSwaps = updatedSwaps.filter((swap) => {
    return (
      (swap.requester?.username?.toLowerCase().includes(searchQueryLower) ||
        swap.recipient?.username?.toLowerCase().includes(searchQueryLower) ||
        swap.requesterSchedule?.workingHours?.toLowerCase().includes(searchQueryLower) ||
        swap.recipientSchedule?.workingHours?.toLowerCase().includes(searchQueryLower) ||
        swap.status?.toLowerCase().includes(searchQueryLower)) &&
      (requesterFilter === '' || swap.requester?.username === requesterFilter) &&
      (recipientFilter === '' || swap.recipient?.username === recipientFilter) &&
      (requesterScheduleFilter === '' || swap.requesterSchedule?.workingHours === requesterScheduleFilter) &&
      (recipientScheduleFilter === '' || swap.recipientSchedule?.workingHours === recipientScheduleFilter) &&
      (statusFilter === '' || swap.status === statusFilter)
    );
  });

  console.log("Filtered Swaps:", filteredSwaps);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Requester</th>
            <th>Recipient</th>
            <th>Requester Schedule</th>
            <th>Recipient Schedule</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSwaps.length > 0 ? (
            filteredSwaps.map((swap) => (
              <tr key={swap._id}>
                <td>{swap.requester.username}</td>
                <td>{swap.recipient.username}</td>
                <td>{swap.requesterSchedule.workingHours}</td>
                <td>{swap.recipientSchedule.workingHours}</td>
                <td>{swap.status}</td>
                
                <td>
                  {swap.adminApproval === 'accepted' || swap.adminApproval === 'rejected' ? (
                    <span>{swap.adminApproval}</span>
                  ) : (
                    <>
                      <button onClick={() => handleAccept(swap._id)}>Accept</button>
                      <button onClick={() => handleReject(swap._id)}>Reject</button>
                    </>
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