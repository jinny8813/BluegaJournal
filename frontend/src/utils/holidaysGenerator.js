const theHolidays = [
  { date: "2025-01-01 ", name: "元旦", break: 7 },
  { date: "2025-01-27", name: "春節補假", break: 7 },
  { date: "2025-01-28", name: "除夕", break: 7 },
  { date: "2025-01-29", name: "春節", break: 7 },
  { date: "2025-01-30", name: "春節", break: 7 },
  { date: "2025-01-31", name: "春節", break: 7 },
  { date: "2025-02-08", name: "春節補班日", break: 8 },
  { date: "2025-02-28", name: "和平紀念日", break: 7 },
  { date: "2025-04-03", name: "清明補假", break: 7 },
  { date: "2025-04-04", name: "清明節 兒童節", break: 7 },
  { date: "2025-05-01", name: "勞動節", break: 1 },
  { date: "2025-05-11", name: "母親節", break: 1 },
  { date: "2025-05-30", name: "端午補假", break: 7 },
  { date: "2025-05-31", name: "端午節", break: 7 },
  { date: "2025-08-08", name: "父親節", break: 1 },
  { date: "2025-10-29", name: "重陽節", break: 1 },
  { date: "2025-09-28", name: "教師節", break: 1 },
  { date: "2025-10-10", name: "國慶日", break: 7 },
  { date: "2025-02-12", name: "元宵節", break: 1 },
  { date: "2025-10-06", name: "中秋節", break: 7 },
  { date: "2025-12-25", name: "行憲紀念日 聖誕節", break: 1 },
  { date: "2025-12-24", name: "平安夜", break: 1 },
  { date: "2025-02-14", name: "情人節", break: 1 },
  { date: "2025-03-08", name: "婦女節", break: 1 },
  { date: "2025-03-12", name: "植樹節", break: 1 },
  { date: "2025-03-14", name: "白色情人節", break: 1 },
  { date: "2025-03-29", name: "青年節", break: 1 },
  { date: "2025-04-01", name: "愚人節", break: 1 },
  { date: "2025-04-22", name: "世界地球日", break: 1 },
  { date: "2025-09-06", name: "中元節", break: 1 },
  { date: "2025-10-25", name: "光復節", break: 1 },
  { date: "2025-10-31", name: "萬聖節", break: 1 },
  { date: "2025-11-11", name: "光棍節", break: 1 },
  { date: "2025-11-27", name: "感恩節", break: 1 },
  { date: "2025-04-20", name: "復活節", break: 1 },
  { date: "2025-02-21", name: "國際母語日", break: 1 },
  { date: "2025-08-29", name: "七夕", break: 1 },
  { date: "2026-01-01", name: "元旦", break: 7 },
];

export const getHolidaysSetting = (date) => {
  let currentDate = { date: date, name: null, break: 0, fontColor: "normal" };

  if (currentDate.date.getDay() === 0) {
    currentDate.break = 7;
  } else if (currentDate.date.getDay() === 6) {
    currentDate.break = 6;
  }

  const isHoliday = theHolidays.filter((e) => {
    const tempDate = new Date(e.date);
    if (tempDate.toDateString() === currentDate.date.toDateString()) {
      return e;
    }
  });

  if (isHoliday.length > 0) {
    currentDate.name = isHoliday[0].name;
    if (isHoliday[0].break > currentDate.break) {
      currentDate.break = isHoliday[0].break;
    }
  }

  if (currentDate.break === 7) {
    currentDate.fontColor = "#ff8080";
  } else if (currentDate.break === 6) {
    currentDate.fontColor = "#ffb3b3";
  } else if (currentDate.break === 1) {
    currentDate.fontColor = "#b3b3ff";
  } else if (currentDate.break === 8) {
    currentDate.fontColor = "normal";
  }

  return currentDate;
};
