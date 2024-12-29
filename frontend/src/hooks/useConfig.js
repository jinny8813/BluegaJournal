import { useState, useEffect, useCallback } from "react";
import { plannerService } from "../services/api/plannerService";

export const useConfig = () => {
  // 布局相關狀態
  const [layouts, setLayouts] = useState(null);
  const [selectedLayouts, setSelectedLayouts] = useState({
    monthly: ["monthly_2_4"],
    weekly: [],
  });
  const [layoutsLoading, setLayoutsLoading] = useState(true);
  const [layoutsError, setLayoutsError] = useState(null);

  // 主題相關狀態
  const [themes, setThemes] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [themesLoading, setThemesLoading] = useState(true);
  const [themesError, setThemesError] = useState(null);

  // 加載布局配置
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLayoutsLoading(true);
        const data = await plannerService.getConfigs();
        setLayouts(data.layouts);
        setLayoutsError(null);
      } catch (error) {
        setLayoutsError(error.message);
      } finally {
        setLayoutsLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  // 加載主題配置
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setThemesLoading(true);
        const data = await plannerService.getConfigs();
        setThemes(data.themes);
        // 設置默認主題
        if (data?.themes?.white) {
          setCurrentTheme(data.themes.white);
        }
        setThemesError(null);
      } catch (error) {
        setThemesError(error.message);
      } finally {
        setThemesLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // 處理布局選擇變化
  const handleLayoutChange = useCallback((layoutId, type) => {
    setSelectedLayouts((prev) => {
      const newLayouts = { ...prev };

      if (type === "monthly") {
        // 月記事至少要選一個
        if (layoutId === prev.monthly[0] && prev.monthly.length === 1) {
          return prev;
        }

        if (prev.monthly.includes(layoutId)) {
          newLayouts.monthly = prev.monthly.filter((id) => id !== layoutId);
        } else {
          newLayouts.monthly = [...prev.monthly, layoutId];
        }
      } else {
        // 週記事可以全部取消
        if (prev.weekly.includes(layoutId)) {
          newLayouts.weekly = prev.weekly.filter((id) => id !== layoutId);
        } else {
          newLayouts.weekly = [...prev.weekly, layoutId];
        }
      }

      return newLayouts;
    });
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
    // 布局相關
    layouts,
    selectedLayouts,
    layoutsLoading,
    layoutsError,
    handleLayoutChange,

    // 主題相關
    themes,
    currentTheme,
    themesLoading,
    themesError,
    handleThemeChange,
  };
};
