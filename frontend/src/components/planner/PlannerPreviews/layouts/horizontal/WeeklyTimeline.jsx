import React from "react";
import { generateWeekDay } from "./shareElements/WeeklyElements";
import {
  generateBasicCalendar,
  generateBasicHolidays,
  generateBasicLunarDates,
} from "./shareElements/MonthlyElements";

const WeeklyTimeline = ({
  dateRange,
  language,
  theme,
  weekStart,
  holidays,
  lunarDate,
}) => {
  return (
    <>
      <div className="text-red-500">
        {dateRange.start.toLocaleDateString()}-
        {dateRange.end.toLocaleDateString()}
      </div>
      {generateWeekDay(language, weekStart, theme)}
      {generateBasicCalendar(dateRange, weekStart, theme, holidays)}
      {holidays === "on" && generateBasicHolidays(dateRange, weekStart, theme)}
      {lunarDate === "on" &&
        generateBasicLunarDates(dateRange, weekStart, theme, holidays)}
    </>
  );
};

export default React.memo(WeeklyTimeline);
