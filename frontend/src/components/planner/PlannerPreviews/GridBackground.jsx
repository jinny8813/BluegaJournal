import React from "react";
import layouts from "../../shared/config/layouts.json";

const GridBackground = ({ selectedLayout = "monthly_2_4", theme }) => {
  const { page_config, base_grid } = layouts;
  const { content_area } = page_config;

  // 如果沒有選擇布局，返回空白內容
  if (!selectedLayout) {
    return null;
  }
  // 獲取布局配置
  const layoutConfig = layouts.layouts[selectedLayout];

  // 如果找不到布局配置，返回空白內容
  if (!layoutConfig) {
    console.warn(`Layout configuration not found for: ${selectedLayout}`);
    return null;
  }
  // 獲取網格線配置
  const { grid_lines } = layoutConfig;

  // 如果沒有網格線配置，返回空白內容
  if (!grid_lines || !grid_lines.vertical || !grid_lines.horizontal) {
    console.warn(
      `Grid lines configuration not found for layout: ${selectedLayout}`
    );
    return null;
  }

  // 獲取主題的網格線顏色
  const backgroundColor = theme?.styles?.background || "#FFFFFF";
  const smallGridColor =
    theme?.styles?.gridLines?.small?.color || "rgba(0,0,0,2)";
  const smallGridWidth = theme?.styles?.gridLines?.small?.width || "0.25px";
  const largeGridColor =
    theme?.styles?.gridLines?.large?.color || "rgba(0,0,0,1)";
  const largeGridWidth = theme?.styles?.gridLines?.large?.width || "0.5px";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: backgroundColor, // 添加背景顏色到整個容器
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${content_area.top}px`,
          left: `${content_area.left}px`,
          width: `${content_area.width}px`,
          height: `${content_area.height}px`,
        }}
      >
        <svg
          width={content_area.width}
          height={content_area.height}
          viewBox={`0 0 ${content_area.width} ${content_area.height}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* 底層網格線 */}
          {Array.from({ length: base_grid.vertical.count }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * base_grid.vertical.gap}
              y1={0}
              x2={i * base_grid.vertical.gap}
              y2={content_area.height}
              stroke={smallGridColor}
              strokeWidth={smallGridWidth}
            />
          ))}
          {Array.from({ length: base_grid.horizontal.count }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * base_grid.horizontal.gap}
              x2={content_area.width}
              y2={i * base_grid.horizontal.gap}
              stroke={smallGridColor}
              strokeWidth={smallGridWidth}
            />
          ))}
          {/* 布局網格線 */}
          {layoutConfig.grid_lines.vertical.map((x, i) => (
            <line
              key={`layout-v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={content_area.height}
              stroke={largeGridColor}
              strokeWidth={largeGridWidth}
            />
          ))}
          {layoutConfig.grid_lines.horizontal.map((y, i) => (
            <line
              key={`layout-h-${i}`}
              x1={0}
              y1={y}
              x2={content_area.width}
              y2={y}
              stroke={largeGridColor}
              strokeWidth={largeGridWidth}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
export default GridBackground;
