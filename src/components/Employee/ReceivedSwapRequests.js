import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReceivedSwaps, updateSwapStatus } from '../../redux/modules/admin';

const ReceivedSwapRequests = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const { receivedSwaps, loading, error } = useSelector((state) => ({
    receivedSwaps: state.admin.swaps.received,
    loading: state.admin.loading.receivedSwaps,
    error: state.admin.error,
  }));
  const [transformedSwaps, setTransformedSwaps] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(fetchReceivedSwaps(user._id));
    }
  }, [dispatch, isAuthenticated, user?._id]);

  useEffect(() => {
    // Transform the swaps only after they are fetched
    if (receivedSwaps && receivedSwaps.length > 0) {
      const transformedData = receivedSwaps.map((swap) => {
        // You can perform any necessary data transformation here
        return swap;
      });
      setTransformedSwaps(transformedData);
    } else {
      setTransformedSwaps([]); // Reset if there are no swaps
    }
  }, [receivedSwaps]);

  const handleAccept = (swapId) => {
    dispatch(updateSwapStatus(swapId, "accepted", "Swap accepted.",user.role)).then(() => {
      dispatch(fetchReceivedSwaps(user._id));
    });
  };

  const handleReject = (swapId) => {
    dispatch(updateSwapStatus(swapId, "rejected", "Swap rejected.",user.role)).then(() => {
      dispatch(fetchReceivedSwaps(user._id));
    });
  };

  if (!isAuthenticated) {
    return <p>You need to log in to view swap requests.</p>;
  }

  // Show loading while fetching received swaps
  if (loading.receivedSwaps) {
    return <p className="loading-message">Loading...</p>;
  }

  // Handle any errors
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="main">
      <h2 className="form-title">Swap Requests Sent To You</h2>
      {transformedSwaps.length > 0 ? (
        <table className="swap-table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            {transformedSwaps.map((swap) => (
              <tr key={swap._id}>
                <td>{swap.requester?.username || "N/A"}</td>
                <td>
                  {swap.requesterSchedule
                    ? `Working Hours: ${swap.requesterSchedule.workingHours || "N/A"}, Off Days: ${swap.requesterSchedule.offDays || "N/A"}`
                    : "N/A"}
                </td>
                <td>{swap.status || "N/A"}</td>
                <td>
                  {swap.status === "pending" ? (
                    <>
                      <button className="btn btn-primary" onClick={() => handleAccept(swap._id)}>Accept</button>
                      <button className="btn btn-danger" onClick={() => handleReject(swap._id)}>Reject</button>
                    </>
                  ) : (
                    <span>{swap.status === "accepted" ? "Accepted" : "Rejected"}</span>
                  )}
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

export default ReceivedSwapRequests;
