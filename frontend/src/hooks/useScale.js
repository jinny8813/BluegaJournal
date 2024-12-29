import { useState, useCallback } from "react";

export const useScale = (defaultScale = 0.75) => {
  const [scale, setScale] = useState(defaultScale);

  const handleScaleChange = useCallback((newScale) => {
    setScale(newScale);
  }, []);

  return {
    scale,
    handleScaleChange,
  };
};
