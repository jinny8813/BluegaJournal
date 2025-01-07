import React from "react";
import { generateWeekDay } from "./shareElements/WeeklyElements";
import { generateBasicCalendar } from "./shareElements/MonthlyElements";

const WeeklyTimeline = ({ dateRange, language, theme, weekStart }) => {
  return (
    <>
      <div className="text-red-500">
        {dateRange.start.toLocaleDateString()}-
        {dateRange.end.toLocaleDateString()}
      </div>
      {generateWeekDay(language, weekStart, theme)}
      {generateBasicCalendar(dateRange, weekStart, theme)}
    </>
  );
};

export default React.memo(WeeklyTimeline);
