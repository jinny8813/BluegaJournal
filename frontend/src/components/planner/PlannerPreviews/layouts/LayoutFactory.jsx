import React from "react";
import MonthlyCalendar from "./horizontal/MonthlyCalendar";
import WeeklyTimeline from "./horizontal/WeeklyTimeline";
import DailyConciseVer from "./horizontal/DailyConciseVer";

const layoutComponents = {
  horizontal: {
    MonthlyCalendar,
    WeeklyTimeline,
    DailyConciseVer,
  },
  vertical: {
    MonthlyCalendar,
  },
};

export const createItems = (layoutId, orientation) => {
  const a1 = layoutId.split("_")[0].toUpperCase().slice(0, 1);
  const a2 = layoutId.split("_")[0].slice(1);
  const b1 = layoutId.split("_")[1].toUpperCase().slice(0, 1);
  const b2 = layoutId.split("_")[1].slice(1);
  return layoutComponents[orientation][a1 + a2 + b1 + b2];
};
