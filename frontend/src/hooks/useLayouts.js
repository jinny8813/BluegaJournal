import { useState, useEffect, useCallback } from "react";
import { plannerService } from "../services/api/plannerService";

export const useLayouts = (orientation = "horizontal") => {
  const [layouts, setLayouts] = useState(null);
  const [contents, setContents] = useState(null);
  const [selectedLayouts, setSelectedLayouts] = useState({
    myLayouts: [], // 改用單一陣列儲存所有選中的布局
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加載布局配置
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const response = await plannerService.getConfigs(orientation);
        setLayouts(response.layouts);
        setContents(response.contents);

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

      const isMonthlyCalendar = layoutId === "monthly_calendar";
      const isDailyLayout = layouts.layouts[layoutId].type === "daily";

      setSelectedLayouts((prev) => {
        // 如果是 monthly_calendar 且已選中，不允許取消
        if (isMonthlyCalendar && prev.myLayouts.includes(layoutId)) {
          return prev;
        }

        let newSelected = [...prev.myLayouts];

        if (isDailyLayout && !prev.myLayouts.includes(layoutId)) {
          newSelected = newSelected.filter(
            (id) => layouts.layouts[id]?.type !== "daily"
          );
        }

        if (prev.myLayouts.includes(layoutId)) {
          // 取消選擇
          newSelected = newSelected.filter((id) => id !== layoutId);
        } else {
          // 新增選擇
          newSelected.push(layoutId);
        }

        // 按照 layouts 排序選中的布局
        const sortedLayouts = newSelected.sort((a, b) => {
          const indexA = Object.keys(layouts.layouts).indexOf(a);
          const indexB = Object.keys(layouts.layouts).indexOf(b);
          return indexA - indexB;
        });

        return {
          myLayouts: sortedLayouts,
        };
      });
    },
    [layouts]
  );

  return {
    contents,
    layouts,
    selectedLayouts,
    loading,
    error,
    handleLayoutChange,
  };
};
