import React from "react";
import MonthlyCalendar from "./horizontal/MonthlyCalendar";

const layoutComponents = {
  horizontal: {
    MonthlyCalendar,
  },
  vertical: {
    MonthlyCalendar,
  },
};

export const createItems = (layoutId, orientation) => {
  const name = layoutId.id.replace("_", "").toUpperCase();

  return layoutComponents[orientation][name];
};
