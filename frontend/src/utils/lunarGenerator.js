export const getLunarOrSolarTerm = (date) => {
  const solar = new Date(date); // 公曆日期
  const lunar = Lunar.fromDate(solar); // 農曆日期與節氣信息

  // 如果該日期有節氣，返回節氣名稱
  if (lunar.solarTerm) {
    return lunar.getJieQi();
  } else {
    return lunar.getDayInChinese();
  }
};
