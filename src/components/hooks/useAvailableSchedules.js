import { useMemo } from "react";

const useAvailableSchedules = (schedules, users, user) => {
  return useMemo(() => {
    console.log("useAvailableSchedules inputs:", { schedules, users, user });

    if (!schedules.length || !users.length || !user) {
      console.log("Missing schedules, users, or user data.");
      return [];
    }

    // Get the current user's schedule
    const requesterSchedule = schedules.find(
      (schedule) => schedule.user && schedule.user._id === user._id
    );

    if (!requesterSchedule) {
      console.log("Requester schedule not found.");
      return [];
    }

    const parseStartTime = (timeRange) => {
      if (!timeRange) {
        console.error("Time range is undefined or null:", timeRange);
        return 0;
      }
      const [start] = timeRange.split("-").map(time => time.trim());
      if (!start) {
        console.error("Invalid time range format:", timeRange);
        return 0;
      }
      const [startHours, startMinutes] = start.split(":").map(Number);
      if (isNaN(startHours) || isNaN(startMinutes)) {
        console.error("Invalid time values in time range:", timeRange);
        return 0;
      }
      return startHours * 60 + startMinutes;
    };

    const isStartTimeGreaterOrEqual = (range1, range2) => {
      const start1 = parseStartTime(range1);
      const start2 = parseStartTime(range2);
      return start1 >= start2;
    };

    // Create a map of the latest schedules for each user
    const latestSchedulesMap = schedules.reduce((map, schedule) => {
      const userId = schedule.user._id;
      if (!map[userId] || new Date(schedule.uploadTime) > new Date(map[userId].uploadTime)) {
        map[userId] = schedule;
      }
      return map;
    }, {});

    // Initialize an array to store eligible schedules
    const eligibleSchedules = [];

    schedules.forEach((schedule) => {
      const scheduleUser = users.find((u) => u._id === schedule.user._id);
      const latestSchedule = latestSchedulesMap[schedule.user._id];

      if (!scheduleUser || scheduleUser._id === user._id || !scheduleUser.isOpenForSwap || scheduleUser.role !== "employee") {
        return;
      }

      if (schedule.skill !== requesterSchedule.skill || schedule.marketPlace !== requesterSchedule.marketPlace) {
        return;
      }

      const scheduleWorkingHours = schedule.workingHours;
      const requesterScheduleWorkingHours = requesterSchedule.workingHours;

      if (!scheduleWorkingHours || !requesterScheduleWorkingHours) {
        console.error("Working hours are undefined for schedule or requester:", scheduleWorkingHours, requesterScheduleWorkingHours);
        return;
      }

      const result = isStartTimeGreaterOrEqual(scheduleWorkingHours, requesterScheduleWorkingHours);

      if (result && schedule._id === latestSchedule._id) {
        eligibleSchedules.push(schedule);
      }
    });

    console.log("Available schedules before return:", eligibleSchedules);
    return eligibleSchedules;
  }, [schedules, users, user]);
};

export default useAvailableSchedules;