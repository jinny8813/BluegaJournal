import React, { useMemo } from "react";
import BaseGrid from "./elements/BaseGrid";
import TableGrid from "./elements/TableGrid";

const PlannerPreviews = ({
  layouts,
  getOrderedLayouts,
  currentTheme,
  scale = 0.75,
  currentPage = 0,
  getMonthlyTitle,
  getWeeklyTitle,
  getMonthlyDates,
  getWeeklyDates,
}) => {
  // 生成預覽頁面配置
  const previewPages = useMemo(() => {
    if (!layouts?.layouts) return [];

    const pages = [];
    const orderedLayouts = getOrderedLayouts();

    // 處理月記事布局
    orderedLayouts.forEach((layout) => {
      if (layout.type === "monthly") {
        const monthlyDates = getMonthlyDates();
        monthlyDates.forEach((date) => {
          pages.push({
            ...layout,
            title: getMonthlyTitle(date, layout.coverTitle),
          });
        });
      } else if (layout.type === "weekly") {
        const weeklyDates = getWeeklyDates();
        weeklyDates.forEach((date) => {
          pages.push({
            ...layout,
            title: getWeeklyTitle(date, layout.coverTitle),
          });
        });
      }
    });

    return pages;
  }, [
    layouts,
    getOrderedLayouts,
    getMonthlyDates,
    getWeeklyDates,
    getMonthlyTitle,
    getWeeklyTitle,
  ]);

  if (!currentTheme || !layouts || previewPages.length === 0) return null;

  // 計算縮放後的紙張尺寸
  const scaledWidth = layouts.page_config.width * scale;
  const scaledHeight = layouts.page_config.height * scale;

  return (
    <div className="p-8">
      <div className="flex flex-col items-center gap-4">
        {previewPages.map((page, index) => (
          <div
            className="relative"
            key={`${page.id}-${page.pageNumber}`}
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            {/* 紙張容器 */}
            <div
              className="absolute top-0 left-0 bg-white shadow-xl overflow-hidden origin-top-left"
              style={{
                width: layouts.page_config.width,
                height: layouts.page_config.height,
                backgroundColor: currentTheme.styles.background,
                transform: `scale(${scale})`,
              }}
            >
              {/* 基礎網格 */}
              <BaseGrid config={layouts.base_grid} theme={currentTheme} />
              {/* 表格網格 */}
              <TableGrid config={page.table_grid} theme={currentTheme} />
              {/* 頁面標題 */}
              <div
                className="absolute top-4 left-4 text-lg font-medium"
                style={{ color: currentTheme.styles.text.page_titles }}
              >
                {page.title}
              </div>
              {/* 頁碼 */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PlannerPreviews);
