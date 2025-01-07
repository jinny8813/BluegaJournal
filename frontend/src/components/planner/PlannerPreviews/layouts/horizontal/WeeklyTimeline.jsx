import React, { useMemo } from "react";

const WeeklyTimeline = ({ dateRange, language }) => {
  // 生成所有月份的日期數據
  // const monthlyData = useMemo(() => {
  //   const generator = createDateGenerator("monthlyCalendar", orientation);
  //   return generator(dateRange, language);
  // }, [dateRange, language, orientation]);
  return (
    <>
      <div className="text-red-500">
        {dateRange.start.toLocaleDateString()}-
        {dateRange.end.toLocaleDateString()}
      </div>
      {/* {monthlyData.map((monthData, index) => (
        <div
          key={monthData.date.getTime()}
          className="monthly-calendar horizontal"
          style={variant.style}
          data-page={index + 1}
        >
          <MonthTitle
            title={monthData.title}
            language={language}
            pageMapping={pageMapping}
          />

          <div className="calendar-grid grid-6x7">
            {monthData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week-row">
                <WeekNumber
                  date={week[0]}
                  language={language}
                  pageMapping={pageMapping}
                />
                {week.map((day) => (
                  <DateCell
                    key={day.getTime()}
                    date={day}
                    language={language}
                    isCurrentMonth={
                      day.getMonth() === monthData.date.getMonth()
                    }
                    isToday={isToday(day)}
                    isSelected={false}
                    onClick={onDateClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))} */}
    </>
  );
};

export default React.memo(WeeklyTimeline);
