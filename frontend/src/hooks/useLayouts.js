import { useState, useEffect, useCallback } from "react";
import { plannerService } from "../services/api/plannerService";

export const useLayouts = () => {
  const [layouts, setLayouts] = useState(null);
  const [selectedLayouts, setSelectedLayouts] = useState({
    horizontal: [], // 改用單一陣列儲存所有選中的布局
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

        // 默認選中 monthly_calender
        if (response.layouts?.layouts?.monthly_calender) {
          setSelectedLayouts({
            horizontal: ["monthly_calender"],
          });
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
      if (!layouts?.layouts?.[layoutId]) return;

      const isMonthlyCalender = layoutId === "monthly_calender";

      setSelectedLayouts((prev) => {
        // 如果是 monthly_calender 且已選中，不允許取消
        if (isMonthlyCalender && prev.horizontal.includes(layoutId)) {
          return prev;
        }

        const newSelected = { ...prev };

        if (prev.horizontal.includes(layoutId)) {
          // 取消選擇
          newSelected.horizontal = prev.horizontal.filter(
            (id) => id !== layoutId
          );
        } else {
          // 新增選擇
          newSelected.horizontal = [...prev.horizontal, layoutId];
        }

        return newSelected;
      });
    },
    [layouts]
  );

  // 獲取已排序的布局列表
  const getOrderedLayouts = useCallback(() => {
    if (!layouts?.layouts || !selectedLayouts.horizontal.length) return [];

    return selectedLayouts.horizontal
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
