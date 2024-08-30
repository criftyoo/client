// LeaveRequests.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests, updateLeaveRequest } from '../../redux/modules/leaves'; // Adjust the import path as necessary

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { leaveRequests, status, error } = useSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(updateLeaveRequest(id, { status: 'approved' }));
  };

  const handleReject = (id) => {
    dispatch(updateLeaveRequest(id, { status: 'rejected' }));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          
          <th>User</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {leaveRequests.map((request) => (
          <tr key={request._id}>
            <td>{request.user.username}</td>
            <td>{request.reason}</td>
            <td>{request.status}</td>
            <td>
              {request.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(request._id)}>Approve</button>
                  <button onClick={() => handleReject(request._id)}>Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaveRequests;