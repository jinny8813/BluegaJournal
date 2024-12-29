import React from "react";

const BaseGrid = ({ config, theme }) => {
  const { horizontal, vertical } = config;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {/* 垂直基礎網格線 */}
      {Array.from({ length: vertical.count }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={vertical.start_left + i * vertical.gap}
          y1={horizontal.start_top}
          x2={vertical.start_left + i * vertical.gap}
          y2={horizontal.end_top}
          stroke={theme.styles.gridLines.small.color}
          strokeWidth={theme.styles.gridLines.small.width}
        />
      ))}

      {/* 水平基礎網格線 */}
      {Array.from({ length: horizontal.count }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={vertical.start_left}
          y1={horizontal.start_top + i * horizontal.gap}
          x2={vertical.end_left}
          y2={horizontal.start_top + i * horizontal.gap}
          stroke={theme.styles.gridLines.small.color}
          strokeWidth={theme.styles.gridLines.small.width}
        />
      ))}
    </svg>
  );
};

export default React.memo(BaseGrid);
