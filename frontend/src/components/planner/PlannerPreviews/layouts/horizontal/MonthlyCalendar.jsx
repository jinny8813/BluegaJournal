import React from "react";

const MonthlyCalendar = ({ dateRange, language, theme, weekStart }) => {
  const generateWeekDay = () => {
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

  const generateCalendar = () => {
    let top = 63;
    let left = 162;
    let width = 18;
    let height = 18;

    let date = new Date(dateRange.start);
    const calendar = [];
    for (let i = 0; i < dateRange.end.getDate(); i++) {
      if (i === 0) {
        left =
          weekStart === "monday"
            ? 162 + width * 6 * (date.getDay() - 1)
            : 162 + width * 6 * date.getDay();
      }
      if (left > 162 + width * 6 * 6) {
        top += height * 6;
        left = 162;
      }
      calendar.push(
        <div
          key={i}
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
          <span style={{ fontSize: "10px" }}>{i + 1}</span>
        </div>
      );
      left += width * 6;
      date.setDate(date.getDate() + 1);
    }
    return calendar;
  };

  return (
    <>
      <div className="text-red-500">
        {dateRange.start.toLocaleDateString()}-
        {dateRange.end.toLocaleDateString()}
      </div>
      {generateWeekDay()}
      {generateCalendar()}
    </>
  );
};

export default React.memo(MonthlyCalendar);
