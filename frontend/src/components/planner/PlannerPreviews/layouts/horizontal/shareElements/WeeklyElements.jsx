import React from "react";

// 月份標題元素
export const generateWeekDay = (language, weekStart, theme) => {
  const weekDaysZh = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日",
  ];
  const weekDaysEn = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // 根據語言選擇 weekDay
  const elements = language === "zh" ? weekDaysZh : weekDaysEn;
  const count = weekStart === "monday" ? 1 : 0;

  // 初始化結果數組
  const weekDayElements = [];
  for (let i = 0; i < 7; i++) {
    weekDayElements.push(
      <div
        key={i} // 添加 key
        className="flex flex-col items-center"
        style={{
          position: "absolute",
          color: theme.page_dynamic_elements,
          top: "45px",
          left: `${162 + 108 * i}px`,
          width: "108px",
          height: "18px",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "10px" }}>{elements[i + count]}</span>
      </div>
    );
  }

  // 返回結果數組
  return weekDayElements;
};
