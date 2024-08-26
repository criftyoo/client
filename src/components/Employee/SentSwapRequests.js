import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSentSwaps } from "../../redux/modules/admin"; 

const SentSwapRequests = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const { sentSwaps, loading, error } = useSelector((state) => ({
    sentSwaps: state.admin.swaps.sent,
    loading: state.admin.loading.sentSwaps,
    error: state.admin.error,
  }));

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(fetchSentSwaps(user._id));
    }
  }, [dispatch, isAuthenticated, user?._id]);

  if (!isAuthenticated) {
    return <p>You need to log in to view swap requests.</p>;
  }

  if (loading.swaps) {
    return <p className="loading-message">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="main">
      <h2 className="form-title">Swap Requests Sent By You</h2>
      {sentSwaps.length > 0 ? (
        <table className="swap-table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sentSwaps.map((swap) => (
              <tr key={swap._id}>
                <td>{swap.recipient?.username || "N/A"}</td>
                <td>
                  {swap.recipientSchedule
                    ? `Working Hours: ${
                        swap.recipientSchedule.workingHours || "N/A"
                      }, Off Days: ${swap.recipientSchedule.offDays || "N/A"}`
                    : "N/A"}
                </td>
                <td>
                  {(() => {
                    switch (swap.status) {
                      case "pending":
                        return <span>Pending</span>;
                      case "accepted":
                        return <span>Accepted</span>;
                      case "rejected":
                        return <span>Rejected</span>;
                        case "cancelled":
                        return <span>Cancelled</span>;
                      default:
                        return <span>Unknown Status</span>;
                    }
                  })()}
                </td>
                <td>
                  {(() => {
                    switch (swap.adminApproval) {
                      case "pending":
                        return <span>Awaiting Approval</span>;
                      case "accepted":
                        return <span>Accepted</span>;
                      case "rejected":
                        return <span>Rejected</span>;
                      default:
                        return <span>Unknown Status</span>;
                    }
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No swap requests found.</p>
      )}
    </div>
  );
};

export default SentSwapRequests;
