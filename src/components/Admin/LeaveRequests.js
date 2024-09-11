import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchLeaveRequests, updateLeaveRequest } from "../../redux/modules/leaves"; // Adjust the import path as necessary
import LoadingMessage from "../common/LoadingMessage";
import ErrorMessage from "../common/ErrorMessage";
import useFetchData from "../hooks/useFetchData";
import exportToExcel from "../common/exportToExcel";
import SelectFilter from "../common/SelectFilter";
import SearchInput from "../common/SearchInput";

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { data: leaveRequests, loading, error } = useFetchData(fetchLeaveRequests, (state) => state.leaves.leaveRequests);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const getUniqueValues = (key) => {
    const values = leaveRequests.map((request) => {
      const keys = key.split('.');
      let value = request;
      for (const k of keys) {
        value = value ? value[k] : 'N/A';
      }
      return value || 'N/A';
    });
    return [...new Set(values)];
  };

  const handleApprove = (id) => {
    dispatch(updateLeaveRequest(id, { status: "approved" }));
  };

  const handleReject = (id) => {
    dispatch(updateLeaveRequest(id, { status: "rejected" }));
  };

  const filteredLeaveRequests = leaveRequests.filter((request) => {
    const username = request.user?.username || 'N/A';
    const reason = request.reason || 'N/A';
    const status = request.status || 'N/A';

    return (
      (username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === '' || status === statusFilter)
    );
  });

  if (loading) return <LoadingMessage message="Loading leave requests..." />;
  if (error) return <ErrorMessage message={`Error: ${error}`} />;
  if (!leaveRequests.length) return <p>No leave requests found.</p>;

  return (
    <div className="main">
      <h2 className="form-title">Leave Requests</h2>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by username, reason, or status..."
      />
      <button className="btn-primary" onClick={() => exportToExcel(filteredLeaveRequests, 'LeaveRequests.xlsx')}>Download as Excel</button>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Reason</th>
            <th>Creation Date</th>
            <th>Last Update</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaveRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.user.username}</td>
              <td>{request.reason}</td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{new Date(request.updatedAt).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td>
                {request.status === "pending" && (
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
    </div>
  );
};

export default LeaveRequests;