// 日期生成器工廠

export const generateMonths = (startDate, duration) => {
  const months = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < duration; i++) {
    const year = currentDate.getFullYear();
    const monthTW = currentDate.toLocaleString("zh-TW", { month: "long" });
    const monthEN = currentDate.toLocaleString("en-US", { month: "long" });
    const monthNumber = currentDate.getMonth() + 1;
    months.push({
      monthsTW: `${year} ${monthTW}`,
      monthsEN: `${year} ${monthEN}`,
      monthsNumber: `${year}${monthNumber}`,
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};
export const generateWeeks = (startDate, duration) => {
  const weeks = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < duration; i++) {
    const year = currentDate.getFullYear();
    const weekNumber = getISOWeekNumber(currentDate);

    weeks.push({
      weeksTW: `${year} 第${weekNumber}週`,
      weeksEN: `${year} Week ${weekNumber}`,
      weeksNumber: `${year}${weekNumber}`,
    });

    currentDate.setDate(currentDate.getDate() + 7);
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
