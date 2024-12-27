import { useState, useCallback } from "react";

export const useConfig = () => {
  const [selectedLayouts, setSelectedLayouts] = useState({
    monthly: ["monthly-calendar"],
    weekly: [],
  });
  const [currentTheme, setCurrentTheme] = useState({ id: "default" });

  const handleLayoutChange = useCallback((layoutId, type) => {
    setSelectedLayouts((prev) => ({
      ...prev,
      [type]: prev[type].includes(layoutId)
        ? prev[type].filter((id) => id !== layoutId)
        : [...prev[type], layoutId],
    }));
  }, []);

  return {
    selectedLayouts,
    currentTheme,
    handleLayoutChange,
    setCurrentTheme,
  };
};
