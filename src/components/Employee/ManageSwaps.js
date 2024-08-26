import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSwaps, updateSwapStatus } from "../../redux/modules/admin";

const ManageSwaps = () => {
  const dispatch = useDispatch();
  const { swaps, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchSwaps());
  }, [dispatch]);

  const handleAccept = (swapId) => {
    dispatch(updateSwapStatus(swapId, "accepted", "Swap accepted.")).then(
      () => {
        dispatch(fetchSwaps());
      }
    );
  };

  const handleReject = (swapId) => {
    dispatch(updateSwapStatus(swapId, "rejected", "Swap rejected.")).then(
      () => {
        dispatch(fetchSwaps());
      }
    );
  };

  return (
    <div className="main">
      <p className="form-title">Received Shift Swap Requests</p>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="swap-table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {swaps.length > 0 ? (
              swaps.map((swap) => (
                <tr key={swap._id}>
                  <td>{swap.requester?.username || "N/A"}</td>
                  <td>
                    {swap.scheduleid
                      ? `Working Hours: ${
                          swap.scheduleid.workingHours || "N/A"
                        }, Off Days: ${
                          swap.scheduleid.offDays || "N/A"
                        }`
                      : "N/A"}
                  </td>
                  <td>{swap.status || "N/A"}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleAccept(swap._id)}>
                      Accept
                    </button>
                    <button className="btn btn-danger" onClick={() => handleReject(swap._id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-requests">No swap requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSwaps;
