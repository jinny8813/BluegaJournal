import React from "react";
import { generateBasicCalendar } from "./shareElements/MonthlyElements";
import { generateWeekDay } from "./shareElements/WeeklyElements";

const MonthlyCalendar = ({ dateRange, language, theme, weekStart, holidays }) => {
  return (
    <>
      <div className="text-red-500">
        {dateRange.start.toLocaleDateString()}-
        {dateRange.end.toLocaleDateString()}
      </div>
      {generateWeekDay(language, weekStart, theme)}
      {generateBasicCalendar(dateRange, weekStart, theme, holidays)}
    </>
  );
};

export default React.memo(MonthlyCalendar);
