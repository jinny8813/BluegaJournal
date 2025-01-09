import { useState, useCallback } from "react";

export const useHolidays = () => {
  const [holidays, setHolidays] = useState("off");

  const handleHolidaysChange = useCallback((newHolidays) => {
    setHolidays(newHolidays);
  }, []);

  return {
    holidays,
    handleHolidaysChange,
  };
};
