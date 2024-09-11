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

      if (!scheduleUser) {
        console.log(`User not found for schedule: ${schedule._id}`);
        return;
      }

      if (scheduleUser._id === user._id) {
        console.log(`Skipping own schedule: ${schedule._id}`);
        return;
      }

      if (!scheduleUser.isOpenForSwap) {
        console.log(`User not open for swap: ${scheduleUser._id}`);
        return;
      }

      if (scheduleUser.role !== "employee") {
        console.log(`User role not eligible: ${scheduleUser.role}`);
        return;
      }

      if (schedule.skill !== requesterSchedule.skill) {
        console.log(`Skill mismatch: ${schedule.skill} vs ${requesterSchedule.skill}`);
        return;
      }

      if (schedule.marketPlace !== requesterSchedule.marketPlace) {
        console.log(`MarketPlace mismatch: ${schedule.marketPlace} vs ${requesterSchedule.marketPlace}`);
        return;
      }

      const scheduleWorkingHours = schedule.workingHours;
      const requesterScheduleWorkingHours = requesterSchedule.workingHours;

      if (!scheduleWorkingHours || !requesterScheduleWorkingHours) {
        console.error("Working hours are undefined for schedule or requester:", scheduleWorkingHours, requesterScheduleWorkingHours);
        return;
      }

      const result = isStartTimeGreaterOrEqual(scheduleWorkingHours, requesterScheduleWorkingHours);

      // Check if the first off day of the available schedule is not after the requester's first off day
      const scheduleFirstOffDay = new Date(schedule.offDays[0]);
      const requesterFirstOffDay = new Date(requesterSchedule.offDays[0]);

      if (result && schedule._id === latestSchedule._id && scheduleFirstOffDay <= requesterFirstOffDay) {
        eligibleSchedules.push(schedule);
      } else {
        console.log(`Schedule not eligible: ${schedule._id}`);
      }
    });

    return eligibleSchedules;
  }, [schedules, users, user]);
};

export default useAvailableSchedules;