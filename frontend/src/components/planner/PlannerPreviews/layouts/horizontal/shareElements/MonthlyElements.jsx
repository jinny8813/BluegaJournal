import React from "react";
import { getHolidaysSetting } from "../../../../../../utils/holidaysGenerator";

// 月份標題元素
export const generateBasicCalendar = (
  dateRange,
  weekStart,
  theme,
  holidays
) => {
  let top = 63;
  let left = 162;
  let width = 18;
  let height = 18;

  let today = new Date(dateRange.start);

  left =
    weekStart === "monday"
      ? 162 + width * 6 * (today.getDay() - 1)
      : 162 + width * 6 * (today.getDay() - 6);

  if (left <= 162) {
    left += width * 6 * 6;
  }

  const basic = [];
  while (today <= dateRange.end) {
    // 計算元素位置
    if (left > 162 + width * 6 * 6) {
      top += height * 6;
      left = 162;
    }

    console.log(holidays);

    // 處理節日邏輯
    const holidayInfo = holidays === "on" ? getHolidaysSetting(today) : null;

    console.log(holidayInfo);

    const fontColor =
      holidayInfo?.fontColor && holidayInfo.fontColor !== "normal"
        ? holidayInfo.fontColor
        : theme.page_dynamic_elements;

    const text = holidayInfo?.name ? `${today.getDate()}` : today.getDate();

    // 創建日曆元素
    basic.push(
      <div
        key={today.getDate()}
        className="flex items-center"
        style={{
          position: "absolute",
          color: fontColor,
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "10px" }}>{text}</span>
      </div>
    );

    // 更新日期
    left += width * 6;
    today.setDate(today.getDate() + 1);
  }
  return basic;
};
