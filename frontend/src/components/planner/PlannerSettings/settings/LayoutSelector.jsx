import React from "react";

const LayoutSelector = ({ layouts, selectedLayouts, onLayoutChange }) => {
  if (!layouts?.layouts) return null;

  // 將布局按類型分組
  const monthlyLayouts = Object.values(layouts.layouts).filter(
    (layout) => layout.type === "monthly"
  );
  const weeklyLayouts = Object.values(layouts.layouts).filter(
    (layout) => layout.type === "weekly"
  );
  const dailyLayouts = Object.values(layouts.layouts).filter(
    (layout) => layout.type === "daily"
  );

  // 計算已選中的類型數量
  const selectedMonthlyCount = selectedLayouts.myLayouts.filter((id) =>
    monthlyLayouts.some((layout) => layout.id === id)
  ).length;

  const selectedWeeklyCount = selectedLayouts.myLayouts.filter((id) =>
    weeklyLayouts.some((layout) => layout.id === id)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {/* 月記事布局 */}
        <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
          月記布局
        </label>
        <div className="flex flex-col">
          {monthlyLayouts.map((layout) => {
            const isSelected = selectedLayouts.myLayouts.includes(layout.id);
            const isMonthlyCalendar = layout.id === "monthly_calendar";

            return (
              <label
                key={layout.id}
                className={`flex items-center space-x-2 ${
                  isMonthlyCalendar
                    ? "cursor-not-allowed"
                    : isSelected
                    ? "cursor-pointer"
                    : selectedMonthlyCount >= 6
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    !isMonthlyCalendar &&
                    (isSelected || selectedMonthlyCount < 6) &&
                    onLayoutChange(layout.id)
                  }
                  disabled={
                    isMonthlyCalendar ||
                    (!isSelected && selectedMonthlyCount >= 6)
                  }
                  className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                    isMonthlyCalendar ? "cursor-not-allowed opacity-50" : ""
                  }`}
                />
                <span className="text-sm text-gray-700">{layout.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      {/* 週記事布局 */}
      <div className="flex space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
          週記布局
        </label>
        <div className="flex flex-col">
          {weeklyLayouts.map((layout) => {
            const isSelected = selectedLayouts.myLayouts.includes(layout.id);

            return (
              <label
                key={layout.id}
                className={`flex items-center space-x-2 ${
                  isSelected
                    ? "cursor-pointer"
                    : selectedWeeklyCount >= 4
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    (isSelected || selectedWeeklyCount < 4) &&
                    onLayoutChange(layout.id)
                  }
                  disabled={!isSelected && selectedWeeklyCount >= 4}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{layout.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      {/* 日記事布局 */}
      <div className="flex space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
          日記布局
        </label>
        <div className="flex flex-col">
          {dailyLayouts.map((layout) => {
            return (
              <label
                key={layout.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedLayouts.myLayouts.includes(layout.id)}
                  onChange={() => onLayoutChange(layout.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{layout.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LayoutSelector);
