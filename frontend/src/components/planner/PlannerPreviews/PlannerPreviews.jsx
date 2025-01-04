import React from "react";
import BaseGrid from "./elements/BaseGrid";
import TableGrid from "./elements/TableGrid";
import Text from "./elements/Text";

const PlannerPreviews = ({
  layouts,
  previewPages,
  currentTheme,
  scale = 0.75,
  contents,
  language = "en",
}) => {
  if (!currentTheme || !layouts || !contents || previewPages.length === 0)
    return null;

  // 計算縮放後的紙張尺寸
  const scaledWidth = layouts.page_config.width * scale;
  const scaledHeight = layouts.page_config.height * scale;

  return (
    <div className="flex flex-col items-center gap-4">
      {previewPages.map((page) => (
        <div
          className="relative"
          key={`${page.id}-${page.pageNumber}`}
          data-page={page.pageNumber}
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
            {/* 頁面標題及內容 */}
            <Text
              language={language}
              pageId={page.id}
              config={contents}
              scale={scale}
              theme={currentTheme.styles.text}
            />
            {/* 頁碼 */}
            <div
              className="absolute bottom-4 right-4 text-sm"
              style={{ color: currentTheme.styles.text.page_numbers }}
            >
              {page.pageNumber}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(PlannerPreviews);
