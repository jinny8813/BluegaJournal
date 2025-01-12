import React from "react";
import BaseGrid from "./elements/BaseGrid";
import TableGrid from "./elements/TableGrid";
import Text from "./elements/Text";
import SubNav from "./elements/SubNav";
import { createItems } from "./layouts/LayoutFactory";

const PlannerPreviews = ({
  layouts,
  allPages,
  currentTheme,
  scale,
  contents,
  language,
  orientation,
  weekStart,
  getPagesByLayoutIdandDate,
  onPageChange,
  holidays,
  lunarDate,
}) => {
  if (!currentTheme || !layouts || !contents || allPages.length === 0)
    return null;

  // 計算縮放後的紙張尺寸
  const scaledWidth = layouts.page_config.width * scale;
  const scaledHeight = layouts.page_config.height * scale;

  const getLayoutComponent = (page, orientation) => {
    const LayoutComponent = createItems(page.layoutId, orientation);
    if (!LayoutComponent) return null;
    return (
      <LayoutComponent
        language={language}
        dateRange={page.dateRange}
        theme={currentTheme.styles.text}
        weekStart={weekStart}
        holidays={holidays}
        lunarDate={lunarDate}
        allPages={allPages}
        getPagesByLayoutIdandDate={getPagesByLayoutIdandDate}
        onPageChange={onPageChange}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 py-8 px-auto">
      {allPages.map((page) => (
        <div
          className="inline-block relative mx-auto"
          key={`${page.layoutId}-${page.pageNumber}`}
          data-page={page.pageNumber}
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
        >
          {/* 紙張容器 */}
          <div
            className="absolute bg-white shadow-xl origin-top-left"
            style={{
              width: layouts.page_config.width,
              height: layouts.page_config.height,
              backgroundColor: currentTheme.styles.background,
              transform: `scale(${scale})`,
            }}
          >
            {page.type === "content" ? (
              <>
                {/* 基礎網格 */}
                <BaseGrid config={layouts.base_grid} theme={currentTheme} />
                {/* 表格網格 */}
                <TableGrid
                  config={page.layout.table_grid}
                  theme={currentTheme}
                />
                {/* 頁面標題及內容 */}
                <Text
                  language={language}
                  pageId={page.layoutId}
                  pageTitle={page.title}
                  contents={contents}
                  theme={currentTheme.styles.text}
                  lunarDate={lunarDate}
                  dateRange={page.dateRange}
                />
                {/* 子導航 */}
                <SubNav
                  language={language}
                  page={page}
                  allPages={allPages}
                  contents={contents}
                  theme={currentTheme.styles.text}
                  getPagesByLayoutIdandDate={getPagesByLayoutIdandDate}
                  onPageChange={onPageChange}
                />
                {/* 選中的布局 */}
                {getLayoutComponent(page, orientation)}
              </>
            ) : (
              <div className="flex flex-row">
                <div
                  className={`bg-white absolute ${
                    currentTheme.id === "darkBrown"
                      ? "opacity-75"
                      : "opacity-25"
                  }`}
                  style={{
                    width: "540px",
                    height: layouts.page_config.height,
                  }}
                ></div>
                <div
                  className="absolute opacity-25"
                  style={{
                    width: "540px",
                    height: layouts.page_config.height,
                    background:
                      "linear-gradient(to bottom, rgba(255, 0, 0, 0.8), rgba(255, 255, 0, 0.8))",
                  }}
                ></div>
                <div>{page.id}</div>
              </div>
            )}
            {/* 頁碼 */}
            <div className="absolute bottom-4 right-4 text-sm">
              {page.pageNumber}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(PlannerPreviews);
