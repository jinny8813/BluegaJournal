import React from "react";

// 月份標題元素
export const generateBasicCalendar = (dateRange, weekStart, theme) => {
  let top = 63;
  let left = 162;
  let width = 18;
  let height = 18;

  let date = new Date(dateRange.start);

  left =
    weekStart === "monday"
      ? 162 + width * 6 * (date.getDay() - 1)
      : 162 + width * 6 * date.getDay();

  const basic = [];
  while (date <= dateRange.end) {
    if (left > 162 + width * 6 * 6) {
      top += height * 6;
      left = 162;
    }
    basic.push(
      <div
        key={date.getDate()}
        className="flex flex-col items-center"
        style={{
          position: "absolute",
          color: theme.page_dynamic_elements,
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <span style={{ fontSize: "10px" }}>{date.getDate()}</span>
      </div>
    );
    left += width * 6;
    date.setDate(date.getDate() + 1);
  }
  return basic;
};
