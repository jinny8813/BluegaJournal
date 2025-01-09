import React from "react";
import {
  generateBasicCalendar,
  generateBasicHolidays,
} from "./shareElements/MonthlyElements";
import { generateWeekDay } from "./shareElements/WeeklyElements";

const MonthlyCalendar = ({
  dateRange,
  language,
  theme,
  weekStart,
  holidays,
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
    </>
  );
};

export default React.memo(MonthlyCalendar);
