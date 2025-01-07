import { useMemo } from "react";
import {
  generateMonths,
  generateWeeks,
  generateDays,
} from "../utils/dateGenerator";

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
  weekStart,
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
            title: monthData.title,
            dateRange: monthData.dateRange,
            layout: layout,
          });
        });
      } else if (layout.type === "weekly") {
        const weeklyData = generateWeeks(weekStart, startDate, duration);
        weeklyData.forEach((weekData) => {
          pageConfigs.push({
            id: `${PAGE_TYPES.CONTENT}-${layoutId}-${weekData.weeksNumber}`,
            pageNumber: pageNumber++,
            type: PAGE_TYPES.CONTENT,
            layoutId: layoutId,
            title: weekData.title,
            dateRange: weekData.dateRange,
            layout: layout,
          });
        });
      } else if (layout.type === "daily") {
        const dailyData = generateDays(startDate, duration);
        dailyData.forEach((dayData) => {
          pageConfigs.push({
            id: `${PAGE_TYPES.CONTENT}-${layoutId}-${dayData.daysNumber}`,
            pageNumber: pageNumber++,
            type: PAGE_TYPES.CONTENT,
            layoutId: layoutId,
            title: dayData.title,
            dateRange: dayData.dateRange,
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
      // 通過頁碼查找頁面
      getPageByNumber: (pageNumber) =>
        pages.find((page) => page.pageNumber === pageNumber),

      // 通過日期查找頁面
      getPagesByDate: (date) => {
        return pages.filter((page) => {
          if (!page.dateRange) return false;
          const { start, end } = page.dateRange;
          return date >= start && date <= end;
        });
      },

      // 通過布局類型查找頁面
      getPagesByLayoutType: (type) =>
        pages.filter((page) => layouts.layouts[page.layoutId]?.type === type),

      // 通過頁面類型查找頁面
      getPagesByType: (type) => pages.filter((page) => page.type === type),

      // 查找特定布局的第一個內容頁
      getFirstContentPage: (layoutId) =>
        pages.find(
          (page) =>
            page.type === PAGE_TYPES.CONTENT && page.layoutId === layoutId
        ),

      // 查找特定月份的頁面
      getMonthlyPages: (year, month) => {
        return pages.filter((page) => {
          if (!page.dateRange) return false;
          const date = page.dateRange.start;
          return date.getFullYear() === year && date.getMonth() === month;
        });
      },

      // 查找特定週次的頁面
      getWeeklyPages: (weekNumber) => {
        return pages.filter((page) => {
          if (!page.dateRange) return false;
          const weekNum = getWeekNumber(page.dateRange.start);
          return weekNum === weekNumber;
        });
      },

      // 生成頁面連結
      createPageLink: (criteria) => {
        let targetPage;

        if (criteria.pageNumber) {
          targetPage = pages.find((p) => p.pageNumber === criteria.pageNumber);
        } else if (criteria.date) {
          targetPage = getPagesByDate(criteria.date)[0];
        } else if (criteria.type && criteria.layoutId) {
          targetPage = pages.find(
            (p) => p.type === criteria.type && p.layoutId === criteria.layoutId
          );
        }

        return targetPage ? `#page-${targetPage.pageNumber}` : null;
      },

      // 獲取目錄數據
      getTableOfContents: () => {
        const toc = {
          chapters: [],
          monthly: {},
          weekly: {},
          daily: {},
        };

        pages.forEach((page) => {
          if (page.type === PAGE_TYPES.CHAPTER) {
            toc.chapters.push({
              title: page.title,
              pageNumber: page.pageNumber,
              layoutId: page.layoutId,
            });
          } else if (page.type === PAGE_TYPES.CONTENT) {
            const layout = layouts.layouts[page.layoutId];
            if (!layout) return;

            const year = page.dateRange.start.getFullYear();
            if (!toc[layout.type][year]) {
              toc[layout.type][year] = [];
            }

            toc[layout.type][year].push({
              title: page.title,
              pageNumber: page.pageNumber,
              dateRange: page.dateRange,
            });
          }
        });

        return toc;
      },

      // 獲取相鄰頁面
      getAdjacentPages: (currentPage) => {
        const index = pages.findIndex((p) => p.pageNumber === currentPage);
        return {
          prev: index > 0 ? pages[index - 1] : null,
          next: index < pages.length - 1 ? pages[index + 1] : null,
        };
      },

      // 獲取總頁數
      getTotalPages: () => pages.length,
    }),
    [pages, layouts]
  );

  return {
    pages,
    ...pageHelpers,
  };
};
