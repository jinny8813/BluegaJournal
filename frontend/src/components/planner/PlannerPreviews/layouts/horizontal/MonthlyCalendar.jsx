import React from "react";

const MonthlyCalendar = ({ dateRange, language, theme }) => {
  const generateWeekDay = () => {
    let weekDay;
    if (language === "zh") {
      weekDay = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ];
    } else {
      weekDay = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
    }
    return weekDay.map((element, index) => (
      <div
        key={index} // 為每個元素加 key
        className="flex flex-col items-center"
        style={{
          position: "absolute",
          color: theme.page_dynamic_elements,
          top: "45px",
          left: `${162 + 108 * index}px`,
          width: "108px",
          height: "18px",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "10px" }}>{element}</span>
      </div>
    ));
  };

  const generateCalendar = () => {
    const firstWeekDay = new Date(dateRange.start).getDay();

    return firstWeekDay;
  };

  return (
    <>
      <div className="text-red-500">
        {dateRange.start.toLocaleDateString()}-
        {dateRange.end.toLocaleDateString()}
      </div>
      {generateWeekDay()}
    </>
  );
};

export default React.memo(MonthlyCalendar);
