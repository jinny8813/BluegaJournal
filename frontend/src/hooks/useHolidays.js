import { useState, useCallback } from "react";

export const useHolidays = () => {
  const [holidays, setHolidays] = useState("false");

  const handleHolidaysChange = useCallback((newHolidays) => {
    setHolidays(newHolidays);
  }, []);

  return {
    holidays,
    handleHolidaysChange,
  };
};
