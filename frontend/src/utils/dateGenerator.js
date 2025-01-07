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

    const nextMonthFirstDate = new Date(
      monthFirstDate.getFullYear(),
      monthFirstDate.getMonth() + 1,
      1
    );

    const monthLastDate = new Date(
      nextMonthFirstDate.setDate(nextMonthFirstDate.getDate() - 1)
    );

    months.push({
      title: {
        tw: `${year} ${monthTW}`,
        en: `${year} ${monthEN}`,
        number: `${year}${monthNumber}`,
      },
      dateRange: {
        start: new Date(
          monthLastDate.getFullYear(),
          monthLastDate.getMonth(),
          1
        ),
        end: monthLastDate,
      },
    });

    monthFirstDate.setMonth(monthFirstDate.getMonth() + 1);
  }
  return months;
};

export const generateWeeks = (weekStart, startDate, duration) => {
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
  const getWeekFirstDate = () => {
    if (weekStart === "monday") {
      return new Date(
        monthFirstDate.setDate(monthFirstDate.getDate() - day + 1)
      );
    } else {
      return new Date(monthFirstDate.setDate(monthFirstDate.getDate() - day));
    }
  };

  const weekFirstDate = getWeekFirstDate();

  while (weekFirstDate <= monthLastDate) {
    let year = weekFirstDate.getFullYear();
    let weekNumber = parseInt(getISOWeekNumber(weekFirstDate));

    if (weekNumber === 53) {
      year = year - 1;
      weekNumber = 1;
    }

    let tempDate = new Date(weekFirstDate);
    let currentFirstDate = new Date(tempDate.setDate(weekFirstDate.getDate()));
    let currentLastDate = new Date(
      tempDate.setDate(currentFirstDate.getDate() + 6)
    );

    weeks.push({
      title: {
        tw: `${year} 第${weekNumber}週`,
        en: `${year} Week ${weekNumber}`,
        number: `${year}${weekNumber}`,
      },
      dateRange: {
        start: currentFirstDate,
        end: currentLastDate,
      },
    });

    weekFirstDate.setDate(weekFirstDate.getDate() + 7);
  }

  return weeks;
};

export const generateDays = (startDate, duration) => {
  const days = [];
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

  let currentDate = new Date(monthFirstDate);

  while (currentDate <= monthLastDate) {
    const date = currentDate.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    console.log(date);
    days.push({
      title: {
        tw: `${date} ${currentDate.toLocaleString("zh-TW", {
          weekday: "long",
        })}`,
        en: `${date} ${currentDate.toLocaleString("en-US", {
          weekday: "short",
        })}`,
        number: `${date}`,
      },
      dateRange: {
        start: currentDate,
        end: currentDate,
      },
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
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
