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
      {vertical.map(([x1, y1, x2, y2], i) => (
        <line
          key={`v-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={theme.styles.gridLines.large.color}
          strokeWidth={theme.styles.gridLines.large.width}
        />
      ))}

      {/* 水平表格線 */}
      {horizontal.map(([x1, y1, x2, y2], i) => (
        <line
          key={`h-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={theme.styles.gridLines.large.color}
          strokeWidth={theme.styles.gridLines.large.width}
        />
      ))}
    </svg>
  );
};

export default React.memo(TableGrid);
