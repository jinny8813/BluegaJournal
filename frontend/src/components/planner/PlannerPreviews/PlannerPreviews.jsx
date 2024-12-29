import React, { useMemo } from "react";
import BaseGrid from "./elements/BaseGrid";
import TableGrid from "./elements/TableGrid";

const PlannerPreviews = ({
  layouts,
  selectedLayouts,
  currentTheme,
  scale = 0.75,
  currentPage = 0,
}) => {
  // 生成預覽頁面配置
  const previewPages = useMemo(() => {
    if (!layouts?.layouts || !selectedLayouts) return [];

    const pages = [];

    // 處理月記事布局
    selectedLayouts.monthly.forEach((layoutId) => {
      const layout = layouts.layouts[layoutId];
      if (layout) {
        // 每個布局生成兩頁
        pages.push(
          {
            ...layout,
            pageNumber: pages.length + 1,
          },
          {
            ...layout,
            pageNumber: pages.length + 2,
          }
        );
      }
    });
    // 處理週記事布局
    selectedLayouts.weekly.forEach((layoutId) => {
      const layout = layouts.layouts[layoutId];
      if (layout) {
        // 每個布局生成兩頁
        pages.push(
          {
            ...layout,
            pageNumber: pages.length + 1,
          },
          {
            ...layout,
            pageNumber: pages.length + 2,
          }
        );
      }
    });

    return pages;
  }, [layouts, selectedLayouts]);

  if (!currentTheme || !layouts || previewPages.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col items-center gap-8">
        {previewPages.map((page, index) => (
          <div
            key={`${page.id}-${page.pageNumber}`}
            className="transition-all duration-300"
          >
            {/* 紙張容器 */}
            <div
              className="shadow-xl"
              style={{
                width: layouts.page_config.width,
                height: layouts.page_config.height,
                backgroundColor: currentTheme.styles.background,
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              {/* 基礎網格 */}
              <BaseGrid config={page.base_grid} theme={currentTheme} />
              {/* 表格網格 */}
              <TableGrid config={page.table_grid} theme={currentTheme} />
              {/* 頁面標題 */}
              <div
                className="absolute top-4 left-4 text-lg font-medium"
                style={{ color: currentTheme.styles.text.page_titles }}
              >
                {page.coverTitle} - {page.pageNumber % 2 === 0 ? "B" : "A"}
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
