import { useState, useEffect, useCallback } from "react";
import { plannerService } from "../services/api/plannerService";

export const useLayouts = (orientation = "horizontal") => {
  const [layouts, setLayouts] = useState(null);
  const [selectedLayouts, setSelectedLayouts] = useState({
    myLayouts: [], // 改用單一陣列儲存所有選中的布局
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加載布局配置
  useEffect(() => {
    console.log("Loading layouts for orientation:", orientation); // 添加日誌
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const response = await plannerService.getConfigs(orientation);
        setLayouts(response.layouts);

        // 重置選中的布局
        const firstMonthlyLayout = Object.values(
          response?.layouts.layouts || {}
        ).find((layout) => layout.type === "monthly");

        if (firstMonthlyLayout) {
          setSelectedLayouts({
            myLayouts: [firstMonthlyLayout.id],
          });
        }
        setError(null);
      } catch (error) {
        console.error("Error loading layouts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, [orientation]);

  // 處理布局變化
  const handleLayoutChange = useCallback(
    (layoutId) => {
      if (!layouts?.layouts?.[layoutId]) return;

      const isMonthlyCalender = layoutId === "monthly_calender";

      setSelectedLayouts((prev) => {
        // 如果是 monthly_calender 且已選中，不允許取消
        if (isMonthlyCalender && prev.myLayouts.includes(layoutId)) {
          return prev;
        }

        const newSelected = { ...prev };

        if (prev.myLayouts.includes(layoutId)) {
          // 取消選擇
          newSelected.myLayouts = prev.myLayouts.filter(
            (id) => id !== layoutId
          );
        } else {
          // 新增選擇
          newSelected.myLayouts = [...prev.myLayouts, layoutId];
        }

        return newSelected;
      });
    },
    [layouts]
  );

  // 獲取已排序的布局列表
  const getOrderedLayouts = useCallback(() => {
    if (!layouts?.layouts || !selectedLayouts.myLayouts.length) return [];

    return selectedLayouts.myLayouts
      .map((id) => layouts.layouts[id])
      .filter(Boolean);
  }, [layouts, selectedLayouts]);

  return {
    layouts,
    selectedLayouts,
    loading,
    error,
    handleLayoutChange,
    getOrderedLayouts,
  };
};
