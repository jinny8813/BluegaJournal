import { useState, useCallback } from "react";

export const useOrientation = () => {
  const [orientation, setOrientation] = useState("horizontal");

  const handleOrientationChange = useCallback((newOrientation) => {
    console.log("Orientation changed to:", newOrientation); // 添加日誌
    setOrientation(newOrientation);
  }, []);

  return {
    orientation,
    handleOrientationChange,
  };
};
