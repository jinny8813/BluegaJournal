import { useState, useEffect, useCallback } from "react";
import { plannerService } from "../services/api/plannerService";

export const useLayouts = () => {
  const [layouts, setLayouts] = useState(null);
  const [selectedLayouts, setSelectedLayouts] = useState({
    monthly: [],
    weekly: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加載布局配置
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const response = await plannerService.getConfigs();
        setLayouts(response.layouts);
        // 設置默認選擇
        if (response.layouts?.layouts?.monthly_calender) {
          setSelectedLayouts((prev) => ({
            ...prev,
            monthly: ["monthly_calender"],
          }));
        }
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  // 處理布局變化
  const handleLayoutChange = useCallback(
    (layoutId) => {
      const layoutType = layouts.layouts[layoutId].type;

      setSelectedLayouts((prev) => {
        const newLayouts = { ...prev };

        // 處理月記事布局
        if (layoutType === "monthly") {
          if (prev.monthly.includes(layoutId)) {
            // 如果是最後一個月記事布局，不允許取消
            if (prev.monthly.length === 1) return prev;
            newLayouts.monthly = prev.monthly.filter((id) => id !== layoutId);
          } else {
            newLayouts.monthly = [...prev.monthly, layoutId];
          }
        }

        // 處理週記事布局
        if (layoutType === "weekly") {
          if (prev.weekly.includes(layoutId)) {
            newLayouts.weekly = prev.weekly.filter((id) => id !== layoutId);
          } else {
            newLayouts.weekly = [...prev.weekly, layoutId];
          }
        }

        return newLayouts;
      });
    },
    [layouts]
  );

  return {
    layouts,
    selectedLayouts,
    loading,
    error,
    handleLayoutChange,
  };
};
