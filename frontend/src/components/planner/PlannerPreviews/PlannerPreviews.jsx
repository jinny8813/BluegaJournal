import React from "react";
import BaseGrid from "./elements/BaseGrid";
import TableGrid from "./elements/TableGrid";

const layouts = {
  page_config: {
    width: 1080,
    height: 720,
  },
  layouts: {
    monthly_2_4: {
      id: "monthly_2_4",
      type: "monthly",
      label: "Monthly Layout 2×4",
      coverTitle: "Monthly Layout I",
      base_grid: {
        horizontal: {
          count: 75,
          gap: 9,
          start_top: 45,
          end_top: 657,
        },
        vertical: {
          count: 113,
          gap: 9,
          start_left: 36,
          end_left: 1044,
        },
      },
      table_grid: {
        horizontal: {
          lines: [0, 612],
          start_left: 36,
          end_left: 1044,
        },
        vertical: {
          lines: [0, 1008],
          start_top: 45,
          end_top: 657,
        },
      },
    },
  },
};

const PlannerPreviews = ({
  selectedLayout = "monthly_2_4",
  currentTheme,
  scale = 0.5,
}) => {
  // 使用傳入的主題或預設主題
  const PageConfig = layouts.page_config;
  const layoutConfig = layouts.layouts[selectedLayout];

  // 假設的內容數據
  const content = {
    month_label: "2024年1月",
  };

  return (
    <div className="h-screen bg-gray-100 p-8">
      <div className="h-full flex flex-col">
        {/* 預覽容器 */}
        <div
          className="shadow-xl"
          style={{
            width: PageConfig.width,
            height: PageConfig.height,
            backgroundColor: currentTheme.styles.background,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {/* 基礎網格 */}
          <BaseGrid config={layoutConfig.base_grid} theme={currentTheme} />

          {/* 表格 */}
          <TableGrid config={layoutConfig.table_grid} theme={currentTheme} />

          {/* 文字 */}
        </div>
      </div>
    </div>
  );
};

export default PlannerPreviews;
