import React from "react";

const TableGrid = ({ config, theme }) => {
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
      {/* 垂直表格線 */}
      {vertical.lines.map((x, i) => (
        <line
          key={`v-${i}`}
          x1={horizontal.start_left + x}
          y1={vertical.start_top}
          x2={horizontal.start_left + x}
          y2={vertical.end_top}
          stroke={theme.styles.gridLines.large.color}
          strokeWidth={theme.styles.gridLines.large.width}
        />
      ))}

      {/* 水平表格線 */}
      {horizontal.lines.map((y, i) => (
        <line
          key={`h-${i}`}
          x1={horizontal.start_left}
          y1={vertical.start_top + y}
          x2={horizontal.end_left}
          y2={vertical.start_top + y}
          stroke={theme.styles.gridLines.large.color}
          strokeWidth={theme.styles.gridLines.large.width}
        />
      ))}
    </svg>
  );
};

export default React.memo(TableGrid);
