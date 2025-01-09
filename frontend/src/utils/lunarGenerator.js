const jeiqi = [
  { cn: "惊蛰", tw: "驚蟄" },
  { cn: "谷雨", tw: "穀雨" },
  { cn: "小满", tw: "小滿" },
  { cn: "芒种", tw: "芒種" },
  { cn: "处暑", tw: "處暑" },
];

export const getLunarOrSolarTerm = (date) => {
  const solar = new Date(date); // 公曆日期
  const lunar = Lunar.fromDate(solar); // 農曆日期與節氣信息

  // 如果該日期有節氣，返回節氣名稱
  if (lunar.getJieQi() !== "") {
    const temp = jeiqi.filter((item) => item.cn === lunar.getJieQi());
    return temp.length > 0 ? temp[0].tw : lunar.getJieQi();
  } else {
    return lunar.getDayInChinese();
  }
};
