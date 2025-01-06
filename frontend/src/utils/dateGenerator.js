// 日期生成器工廠

export const generateMonths = (startDate, duration) => {
  const months = [];
  const monthFirstDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );

  for (let i = 0; i < duration; i++) {
    const year = monthFirstDate.getFullYear();
    const monthTW = monthFirstDate.toLocaleString("zh-TW", { month: "long" });
    const monthEN = monthFirstDate.toLocaleString("en-US", { month: "long" });
    const monthNumber = monthFirstDate.getMonth() + 1;
    months.push({
      tw: `${year} ${monthTW}`,
      en: `${year} ${monthEN}`,
      number: `${year}${monthNumber}`,
    });

    monthFirstDate.setMonth(monthFirstDate.getMonth() + 1);
  }
  return months;
};
export const generateWeeks = (startDate, duration) => {
  const weeks = [];
  const monthFirstDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );

  const nextMonthFirstDate = new Date(
    monthFirstDate.getFullYear(),
    monthFirstDate.getMonth() + duration,
    1
  );

  const monthLastDate = new Date(
    nextMonthFirstDate.setDate(nextMonthFirstDate.getDate() - 1)
  );

  const day = monthFirstDate.getDay(); // 取得星期幾 (0: 星期日, 1: 星期一, ..., 6: 星期六)
  // ISO 週以星期一為一週的開始
  const weekFirstDate = new Date(
    monthFirstDate.setDate(monthFirstDate.getDate() - day + 1 - 7)
  );

  const weekLastDate = new Date(
    weekFirstDate.setDate(weekFirstDate.getDate() + 6)
  );

  console.log(weekFirstDate);

  while (weekFirstDate <= monthLastDate) {
    let year = weekFirstDate.getFullYear();
    let weekNumber = parseInt(getISOWeekNumber(weekFirstDate)) + 1;

    if (weekNumber === 53) {
      year = year - 1;
      weekNumber = 1;
    }

    weeks.push({
      tw: `${year} 第${weekNumber}週`,
      en: `${year} Week ${weekNumber}`,
      number: `${year}${weekNumber}`,
    });

    weekFirstDate.setDate(weekFirstDate.getDate() + 7);
  }

  return weeks;
};

function getISOWeekNumber(date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);

  // 計算當年的星期四
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));

  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);

  return weekNumber;
}
