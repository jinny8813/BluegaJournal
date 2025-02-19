import { useState, useCallback, useMemo } from "react";

export const useDateRange = (initialDuration = 3) => {
  const [startDate, setStartDate] = useState(new Date());
  const [duration, setDuration] = useState(initialDuration);

  // 處理日期變化
  const handleDateChange = useCallback((newDate) => {
    setStartDate(newDate);
  }, []);

  // 處理月數變化
  const handleDurationChange = useCallback((newDuration) => {
    setDuration(newDuration);
  }, []);

  // 計算結束日期
  const endDate = useMemo(() => {
    const end = new Date(startDate);
    end.setMonth(startDate.getMonth() + duration);
    return end;
  }, [startDate, duration]);

  // 生成月份頁面標題
  const getMonthlyTitle = useCallback((date, coverTitle) => {
    return `${date.getFullYear()} ${date.toLocaleString("en-US", {
      month: "long",
    })} ${coverTitle}`;
  }, []);

  // 生成週次頁面標題
  const getWeeklyTitle = useCallback((date, coverTitle) => {
    const year = date.getFullYear();
    const weekNum = getWeekNumber(date);

    // 處理年末週次
    if (weekNum === 1 && date.getMonth() === 11) {
      return `${year + 1} Week ${weekNum} ${coverTitle}`;
    }

    return `${year} Week ${weekNum} ${coverTitle}`;
  }, []);

  // 獲取指定日期的所有月份
  const getMonthlyDates = useCallback(() => {
    const dates = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < duration; i++) {
      dates.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dates;
  }, [startDate, duration]);

  // 獲取指定日期範圍的所有週次
  const getWeeklyDates = useCallback(() => {
    const dates = [];
    const current = new Date(startDate);
    current.setDate(1); // 設置為月初
    const end = new Date(endDate);
    end.setMonth(end.getMonth() + 1, 0); // 設置為月末

    // 設置為第一週的開始
    current.setDate(current.getDate() - current.getDay());

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }

    return dates;
  }, [startDate, endDate]);

  return {
    startDate,
    duration,
    handleDateChange,
    handleDurationChange,
    getMonthlyTitle,
    getWeeklyTitle,
    getMonthlyDates,
    getWeeklyDates,
  };
};

// 輔助函數：獲取週次
function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}
