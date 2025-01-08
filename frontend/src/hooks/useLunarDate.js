import { useState, useCallback } from "react";

export const useLunarDate = () => {
  const [lunarDate, setLunarDate] = useState("false");

  const handleLunarDateChange = useCallback((newLunarDate) => {
    setLunarDate(newLunarDate);
  }, []);

  return {
    lunarDate,
    handleLunarDateChange,
  };
};
