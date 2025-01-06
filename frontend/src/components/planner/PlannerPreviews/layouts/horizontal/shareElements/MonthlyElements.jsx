import React from "react";

// 月份標題元素
export const MonthTitle = React.memo(({ date, language, pageMapping }) => {
  const monthLink = createPageLink("monthly", date.getMonth() + 1, pageMapping);

  if (language === "bilingual") {
    return (
      <a href={monthLink} className="month-title">
        <span className="text-lg">
          {format(date, "MMMM", { locale: enUS })}
        </span>
        <span className="text-sm">{format(date, "M月", { locale: zhTW })}</span>
      </a>
    );
  }
  // ... 其他語言處理
});

// 週次元素
export const WeekNumber = React.memo(({ date, language, pageMapping }) => {
  const weekNum = getWeek(date);
  const weekLink = createPageLink("weekly", weekNum, pageMapping);

  return (
    <a href={weekLink} className="week-number">
      {formatters.weekNumber(date, language)}
    </a>
  );
});

// 日期單元格
export const DateCell = React.memo(
  ({ date, language, isToday, isSelected, onClick }) => {
    const dateFormat = formatters.bilingual(date);

    return (
      <div
        className={`date-cell ${isToday ? "today" : ""} ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => onClick?.(date)}
      >
        {language === "bilingual" ? (
          <>
            <span className="text-base">{dateFormat.main}</span>
            <span className="text-xs">{dateFormat.sub}</span>
          </>
        ) : (
          // ... 其他語言處理
          <span className="text-base">{dateFormat.main}</span>
        )}
      </div>
    );
  }
);
