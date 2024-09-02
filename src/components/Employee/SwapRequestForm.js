import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSwapRequestAction,
  resetSwapRequest,
} from "../../redux/modules/employee";
import { fetchAllSchedules } from "../../redux/modules/admin";
import { fetchAllUsers } from "../../redux/modules/users"; // Import the new action

const SwapRequestForm = () => {
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();

  // Fetch schedules and users on component mount
  useEffect(() => {
    dispatch(fetchAllSchedules());
    dispatch(fetchAllUsers()); // Dispatch the new action
  }, [dispatch]);

  // Accessing schedules, users, and swap status from Redux state
  const { error, loadingSwap, swapRequest } = useSelector(
    (state) => state.employee
  );
  const { schedules, loadingSchedules } = useSelector((state) => state.admin);
  const { users, usersLoading, user } = useSelector((state) => state.users); // Access users and user from state

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedScheduleId) {
      setFormError("Please select a schedule.");
      return;
    }
    const recipientScheduleId = selectedScheduleId;

    const requesterSchedule = schedules.find(
      (schedule) => schedule.user && schedule.user._id === user._id
    );

    if (!requesterSchedule) {
      setFormError("You have no active schedules to swap.");
      return;
    }

    const recipientSchedule = schedules.find(
      (schedule) => schedule._id === recipientScheduleId
    );

    if (!recipientSchedule) {
      setFormError("Recipient schedule not found.");
      return;
    }

    const requesterScheduleId = requesterSchedule._id;
    const recipientId = recipientSchedule.user._id;
    const requesterId = user._id;

    dispatch(
      createSwapRequestAction(
        recipientScheduleId,
        requesterScheduleId,
        recipientId,
        requesterId
      )
    );
  };

  // Filter schedules for the dropdown based on fetched users
  const availableSchedules = schedules.filter((schedule) => {
    const scheduleUser = users.find((u) => u._id === schedule.user._id);

    return (
      scheduleUser &&
      scheduleUser._id !== user._id &&
      scheduleUser.isOpenForSwap === true &&
      scheduleUser.role === "employee"
    );
  });

  // Update formError when error changes
  useEffect(() => {
    if (error) {
      setFormError(error);
    } else {
      setFormError("");
    }
  }, [error]);

  // Reset formError and swapRequest when selectedScheduleId changes
  useEffect(() => {
    setFormError("");
    dispatch(resetSwapRequest());
  }, [selectedScheduleId, dispatch]);

  return (
    <div className="main manage-leave-main">
      <h2 className="form-title">Swap Requester</h2>
      {/* Display loading message */}
      {loadingSchedules && <p>Loading schedules...</p>}
      {usersLoading && <p>Loading users...</p>}

      {/* Display error message and form */}
      {!loadingSchedules && !usersLoading && schedules && user && (
        <>
          <form onSubmit={handleSubmit}>
            <label>Select a schedule:</label>

            {availableSchedules.length > 0 ? (
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                required
              >
                <option value="">--Select--</option>
                {availableSchedules.map((schedule) => (
                  <option key={schedule._id} value={schedule._id}>
                    {schedule.workingHours} - Off Days:{" "}
                    {schedule.offDays.join(", ")} - Week:{" "}
                    {schedule.week}
                  </option>
                ))}
              </select>
            ) : (
              <p>No one is available to swap with.</p>
            )}

            <button
              type="submit"
              disabled={loadingSwap || availableSchedules.length === 0}
            >
              {loadingSwap ? "Submitting..." : "Submit"}
            </button>
          </form>
        </>
      )}

      {/* Show error or success message */}
      {formError && <p className="error-message">Error: {formError}</p>}
      {swapRequest && <p className="success-message">Swap Request Sent To The User Successfully!</p>}
    </div>
  );
};

export default SwapRequestForm;