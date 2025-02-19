import React from "react";
import { getHolidaysSetting } from "../../../../../../utils/holidaysGenerator";
import { getLunarOrSolarTerm } from "../../../../../../utils/lunarGenerator";

const BASE_CONFIG = {
  calendar: { top: 63, left: 162, width: 18, height: 18 },
  holidays: { top: 63, left: 180, width: 18, height: 9 },
  lunar: { top: 72, left: 180, width: 18, height: 9 },
};

const calculateStartPosition = (date, baseLeft, width, weekStart) => {
  let left = baseLeft;
  const dayOfWeek = date.getDay();

  if (weekStart === "monday") {
    left += width * 6 * (dayOfWeek - 1);
    if (dayOfWeek === 0) left += width * 6 * 7;
  } else {
    left += width * 6 * (dayOfWeek - 6);
    if (left <= baseLeft) left += width * 6 * 6;
  }

  return left;
};

// 獲取字體顏色
const getFontColor = (date, theme, holidays) => {
  if (holidays !== "on") return theme.page_dynamic_elements;

  const holidayInfo = getHolidaysSetting(date);
  return holidayInfo?.fontColor && holidayInfo.fontColor !== "normal"
    ? holidayInfo.fontColor
    : theme.page_dynamic_elements;
};

const generateElements = (
  dateRange,
  weekStart,
  theme,
  config,
  renderElement,
  holidays = "off"
) => {
  const elements = [];
  let { top, left: baseLeft, width, height } = config;
  let currentDate = new Date(dateRange.start);
  let left = calculateStartPosition(currentDate, baseLeft, width, weekStart);
  const maxLeft = baseLeft + width * 6 * 6;

  while (currentDate <= dateRange.end) {
    if (left > maxLeft) {
      top += height * (config === BASE_CONFIG.calendar ? 6 : 12);
      left = baseLeft;
    }

    const fontColor = getFontColor(currentDate, theme, holidays);
    elements.push(
      renderElement(currentDate, { top, left, width, height, fontColor })
    );

    left += width * 6;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return elements;
};

// 獲取日記頁面
const getDailyPage = (date, allPages, getPagesByLayoutIdandDate) => {
  if (!allPages || !getPagesByLayoutIdandDate) return null;

  const dailyLayout = allPages.find(
    (p) => p.type === "chapter" && p.layout_type === "daily"
  );

  if (!dailyLayout) return null;

  const targetPages = getPagesByLayoutIdandDate(dailyLayout.layoutId, {
    start: date,
    end: date,
  });

  return targetPages?.[0] || null;
};

// 生成日期元素樣式
const getDateElementStyle = (style, hasDaily) => ({
  position: "absolute",
  color: style.fontColor,
  ...style,
  justifyContent: "center",
  cursor: hasDaily ? "pointer" : "default",
});

// 月份標題元素
export const generateBasicCalendar = (
  dateRange,
  weekStart,
  theme,
  holidays,
  allPages = null,
  getPagesByLayoutIdandDate = null,
  onPageChange = null
) => {
  return generateElements(
    dateRange,
    weekStart,
    theme,
    BASE_CONFIG.calendar,
    (date, style) => {
      const dailyPage = getDailyPage(date, allPages, getPagesByLayoutIdandDate);
      const hasDaily = Boolean(dailyPage);

      return (
        <div
          key={date.getDate()}
          className="flex items-center"
          style={getDateElementStyle(style, hasDaily)}
          onClick={() => {
            if (hasDaily && onPageChange) {
              onPageChange(dailyPage.pageNumber);
            }
          }}
          title={hasDaily ? "點擊查看日記" : ""}
        >
          <span style={{ fontSize: "10px" }}>{date.getDate()}</span>
        </div>
      );
    },
    holidays
  );
};

// 月份節日元素
export const generateBasicHolidays = (
  dateRange,
  weekStart,
  theme,
  holidays
) => {
  if (holidays !== "on") return []; // 如果 holidays 關閉，不渲染節日

  return generateElements(
    dateRange,
    weekStart,
    theme,
    BASE_CONFIG.holidays,
    (date, style) => {
      const holidayInfo = getHolidaysSetting(date);
      return (
        <div
          key={`${date.getTime()}-${holidayInfo.name}`}
          className="flex items-center"
          style={{
            position: "absolute",
            color: style.fontColor,
            ...style,
            overflow: "visible",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "6px" }}>&nbsp;{holidayInfo.name}</span>
        </div>
      );
    },
    holidays
  );
};

// 月份農曆元素
export const generateBasicLunarDates = (
  dateRange,
  weekStart,
  theme,
  holidays
) => {
  return generateElements(
    dateRange,
    weekStart,
    theme,
    BASE_CONFIG.lunar,
    (date, style) => {
      const lunarInfo = getLunarOrSolarTerm(date);
      return (
        <div
          key={`${date.getTime()}-${lunarInfo}`}
          className="flex items-center"
          style={{
            position: "absolute",
            color: style.fontColor,
            ...style,
            overflow: "visible",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "6px" }}>&nbsp;{lunarInfo}</span>
        </div>
      );
    },
    holidays
  );
};
