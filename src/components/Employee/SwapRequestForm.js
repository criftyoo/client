import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSwapRequestAction, resetSwapRequest } from "../../redux/modules/employee";
import { fetchSchedules } from "../../redux/modules/admin";
import { fetchUsers } from "../../redux/modules/users";
import SwapRequestFormContent from "./SwapRequestFormContent";
import useAvailableSchedules from "../hooks/useAvailableSchedules";
import useForm from "../hooks/useForm";
import LoadingMessage from "../common/LoadingMessage";
import ErrorMessage from "../common/ErrorMessage";

const SwapRequestForm = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSchedules());
    dispatch(fetchUsers());
  }, [dispatch]);

  const { schedules = [], loadingSchedules } = useSelector((state) => state.admin || {});
  const { users = [], usersLoading, user } = useSelector((state) => state.users || {});
  const { error, loadingSwap, swapRequest } = useSelector((state) => state.employee || {});

  const availableSchedules = useAvailableSchedules(schedules, users, user);

  useEffect(() => {
  }, [availableSchedules]);

  const onSubmit = useCallback((formData, setFormError) => {
    const { selectedScheduleId } = formData;

    if (!selectedScheduleId) {
      setFormError("Please select a schedule.");
      return;
    }

    const recipientSchedule = schedules.find((schedule) => schedule._id === selectedScheduleId);

    if (!recipientSchedule) {
      setFormError("Recipient schedule not found.");
      return;
    }

    const requesterSchedule = schedules.find((schedule) => schedule.user && schedule.user._id === user._id);

    if (!requesterSchedule) {
      setFormError("You have no active schedules to swap.");
      return;
    }

    // Additional validation to avoid race conditions
    if (loadingSchedules || usersLoading) {
      setFormError("Data is still loading. Please wait.");
      return;
    }

    if (!user || !recipientSchedule.user || !requesterSchedule.user) {
      setFormError("User data is incomplete. Please try again.");
      return;
    }

    dispatch(
      createSwapRequestAction(
        selectedScheduleId,
        requesterSchedule._id,
        recipientSchedule.user._id,
        user._id,
        recipientSchedule.skill,
        recipientSchedule.marketPlace
      )
    );
    
  }, [schedules, user, loadingSchedules, usersLoading, dispatch]);

  const { formData, formError, handleChange, handleSubmit, setFormError } = useForm({ selectedScheduleId: "" }, onSubmit);

  useEffect(() => {
    setFormError(error || "");
  }, [error, setFormError]);

  useEffect(() => {
    setFormError("");
    dispatch(resetSwapRequest());
  }, [formData.selectedScheduleId, dispatch, setFormError]);

  return (
    <div className="main manage-leave-main">
      <h2 className="form-title">Swap Requester</h2>
      {loadingSchedules && <LoadingMessage message="Loading schedules..." />}
      {usersLoading && <LoadingMessage message="Loading users..." />}

      {!loadingSchedules && !usersLoading && schedules && user && (
        <SwapRequestFormContent
          availableSchedules={availableSchedules}
          selectedScheduleId={formData.selectedScheduleId}
          setSelectedScheduleId={(id) => handleChange({ target: { name: "selectedScheduleId", value: id } })}
          handleSubmit={handleSubmit}
          loadingSwap={loadingSwap}
          user={user}
        />
      )}

      {formError && <ErrorMessage message={formError} />}
      {swapRequest && <p className="success-message">Swap Request Sent To The User Successfully!</p>}
    </div>
  );
};

export default SwapRequestForm;