import { useState, useCallback } from "react";

export const useLanguage = () => {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);

  return {
    language,
    handleLanguageChange,
  };
};
