import { useState, useEffect, useCallback } from "react";
import { plannerService } from "../services/api/plannerService";

export const useThemes = () => {
  const [themes, setThemes] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加載主題配置
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const response = await plannerService.getConfigs();
        setThemes(response.themes);
        // 設置默認主題
        if (response.themes?.themes?.white) {
          setCurrentTheme(response.themes.themes.white);
        }
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // 處理主題變化
  const handleThemeChange = useCallback(
    (themeId) => {
      if (themes?.themes?.[themeId]) {
        setCurrentTheme(themes.themes[themeId]);
      }
    },
    [themes]
  );

  return {
    themes,
    currentTheme,
    loading,
    error,
    handleThemeChange,
  };
};
