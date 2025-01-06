import { useMemo } from "react";
import { generateMonths, generateWeeks } from "../utils/dateGenerator";

// 頁面類型枚舉
export const PAGE_TYPES = {
  COVER: "cover",
  SECTION: "section",
  CHAPTER: "chapter",
  CONTENT: "content",
  BACK_COVER: "backCover",
};

export const usePageConfiguration = ({
  layouts,
  selectedLayouts,
  startDate,
  duration,
}) => {
  // 生成所有頁面配置
  const pages = useMemo(() => {
    if (!layouts?.layouts) return [];

    const pageConfigs = [];
    let pageNumber = 1;

    // 添加封面
    const end = new Date(startDate);
    end.setMonth(startDate.getMonth() + duration);
    const isCrossYear = startDate.getFullYear() !== end.getFullYear();
    let coverTitle = "";
    if (isCrossYear) {
      coverTitle = `${startDate.getFullYear()} - ${end.getFullYear()}`;
    } else {
      coverTitle = `${startDate.getFullYear()}`;
    }
    pageConfigs.push({
      id: PAGE_TYPES.COVER,
      pageNumber: pageNumber++,
      type: PAGE_TYPES.COVER,
      layoutId: PAGE_TYPES.COVER,
      title: coverTitle,
    });

    // 添加區段頁
    pageConfigs.push({
      id: PAGE_TYPES.SECTION,
      pageNumber: pageNumber++,
      type: PAGE_TYPES.SECTION,
      layoutId: PAGE_TYPES.SECTION,
      title: "區段",
    });

    // 處理內容頁面
    selectedLayouts.myLayouts.forEach((layoutId) => {
      const layout = layouts.layouts[layoutId];
      // 添加章節頁
      pageConfigs.push({
        id: `${PAGE_TYPES.CHAPTER}-${layoutId}`,
        pageNumber: pageNumber++,
        type: PAGE_TYPES.CHAPTER,
        layoutId: layoutId,
        title: "章節",
      });

      if (layout.type === "monthly") {
        const monthlyData = generateMonths(startDate, duration);
        monthlyData.forEach((monthData) => {
          pageConfigs.push({
            id: `${PAGE_TYPES.CONTENT}-${layoutId}-${monthData.monthsNumber}`,
            pageNumber: pageNumber++,
            type: PAGE_TYPES.CONTENT,
            layoutId: layoutId,
            title: monthData,
            layout: layout,
          });
        });
      } else if (layout.type === "weekly") {
        const weeklyData = generateWeeks(startDate, duration);
        weeklyData.forEach((weekData) => {
          pageConfigs.push({
            id: `${PAGE_TYPES.CONTENT}-${layoutId}-${weekData.weeksNumber}`,
            pageNumber: pageNumber++,
            type: PAGE_TYPES.CONTENT,
            layoutId: layoutId,
            title: weekData,
            layout: layout,
          });
        });
      }
    });

    // 添加封底
    pageConfigs.push({
      id: PAGE_TYPES.BACK_COVER,
      pageNumber: pageNumber++,
      type: PAGE_TYPES.BACK_COVER,
      layoutId: PAGE_TYPES.BACK_COVER,
      title: coverTitle,
    });

    return pageConfigs;
  }, [layouts, selectedLayouts, startDate, duration]);

  // 頁面導航輔助方法
  const pageHelpers = useMemo(
    () => ({
      // 創建頁面連結
      // createPageLink: (type, value) => {
      //   const key = `${type}-${value}`;
      //   const pageNumber = pageMapping.get(key);
      //   return pageNumber ? `#page-${pageNumber}` : null;
      // },

      // 獲取總頁數
      getTotalPages: () => pages.length,
    }),
    [pages]
  );

  return {
    pages,
    ...pageHelpers,
  };
};
