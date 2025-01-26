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
  rowVirtualizer,
}) => {
  if (!currentTheme || !layouts || !contents || allPages.length === 0)
    return null;

  // 計算縮放後的紙張尺寸
  const scaledWidth = layouts.page_config.width * scale;
  const scaledHeight = layouts.page_config.height * scale;

  // 渲染每個頁面的內容
  const renderPage = (page, index) => {
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
      <div
        key={`${page.layoutId}-${page.pageNumber}`}
        className="inline-block relative mx-auto"
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
              <TableGrid config={page.layout.table_grid} theme={currentTheme} />
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
                  currentTheme.id === "darkBrown" ? "opacity-75" : "opacity-25"
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
    );
  };

  return (
    <div
      style={{
        height: rowVirtualizer.getTotalSize(), // 總高度
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const page = allPages[virtualRow.index];
        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualRow.measureRef} // 用於測量元素高度
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderPage(page, virtualRow.index)}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(PlannerPreviews);
