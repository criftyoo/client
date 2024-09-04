import { useMemo } from "react";

const useAvailableSchedules = (schedules, users, user) => {
  return useMemo(() => {
    const requesterSchedule = schedules.find(
      (schedule) => schedule.user && schedule.user._id === user._id
    );

    return schedules
      .sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime))
      .filter((schedule, index, self) => {
        const scheduleUser = users.find((u) => u._id === schedule.user._id);
        const latestSchedule = self.find(
          (s) => s.user._id === schedule.user._id
        );

        return (
          scheduleUser &&
          scheduleUser._id !== user._id &&
          scheduleUser.isOpenForSwap === true &&
          scheduleUser.role === "employee" &&
          schedule?.skill === requesterSchedule?.skill &&
          schedule?.marketPlace === requesterSchedule?.marketPlace &&
          schedule._id === latestSchedule._id
        );
      });
  }, [schedules, users, user]);
};

export default useAvailableSchedules;