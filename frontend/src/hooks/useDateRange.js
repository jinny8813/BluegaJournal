import { useState, useCallback } from "react";

export const useDateRange = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [duration, setDuration] = useState(3);

  const handleDateChange = useCallback((newDate) => {
    setStartDate(newDate);
  }, []);

  const handleDurationChange = useCallback((newDuration) => {
    setDuration(newDuration);
  }, []);

  return {
    startDate,
    duration,
    handleDateChange,
    handleDurationChange,
  };
};
