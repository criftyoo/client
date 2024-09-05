import React from "react";

const SwapRequestFormContent = ({
  availableSchedules,
  selectedScheduleId,
  setSelectedScheduleId,
  handleSubmit,
  loadingSwap,
  user,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>Select a schedule:</label>
      {availableSchedules.length > 0 ? (
        <select
          value={selectedScheduleId}
          onChange={(e) => setSelectedScheduleId(e.target.value)}
          required
        >
          <option value="">--Select--</option>
          {availableSchedules.map((schedule) => {
            const isRequestSent = schedule.swapRequests.some((requestId) =>
              user.swapRequests.includes(requestId)
            );
            return (
              <option
                key={`${schedule._id}-${isRequestSent}`} // Use a unique key that changes when isRequestSent changes
                value={schedule._id}
                className={isRequestSent ? "option-request-sent" : ""}
              >
                {schedule.workingHours} - Off Days: {schedule.offDays.join(", ")} - Week: {schedule.week} - Skill: {schedule.skill} - Market Place: {schedule.marketPlace}
                {isRequestSent && " (Request Sent)"}
              </option>
            );
          })}
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
  );
};

export default SwapRequestFormContent;