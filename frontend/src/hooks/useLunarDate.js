import { useState, useCallback } from "react";

export const useLunarDate = () => {
  const [lunarDate, setLunarDate] = useState("off");

  const handleLunarDateChange = useCallback((newLunarDate) => {
    setLunarDate(newLunarDate);
  }, []);

  return {
    lunarDate,
    handleLunarDateChange,
  };
};
