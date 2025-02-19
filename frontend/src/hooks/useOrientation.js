import { useState, useCallback } from "react";

export const useOrientation = () => {
  const [orientation, setOrientation] = useState("horizontal");

  const handleOrientationChange = useCallback((newOrientation) => {
    setOrientation(newOrientation);
  }, []);

  return {
    orientation,
    handleOrientationChange,
  };
};
