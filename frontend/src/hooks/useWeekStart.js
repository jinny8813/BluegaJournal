import { useState, useCallback } from "react";

export const useWeekStart = () => {
  const [weekStart, setWeekStart] = useState("monday");

  const handleWeekStartChange = useCallback((newWeekStart) => {
    setWeekStart(newWeekStart);
  }, []);

  return {
    weekStart,
    handleWeekStartChange,
  };
};
