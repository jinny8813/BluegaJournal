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

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {/* 月記事布局 */}
        <label className="text-sm font-medium text-gray-700 min-w-[5rem]">
          月記事布局
        </label>
        <div className="flex flex-col">
          {monthlyLayouts.map((layout) => {
            const isSelected = selectedLayouts.myLayouts.includes(layout.id);
            const isMonthlyCalendar = layout.id === "monthly_calendar";

            return (
              <label
                key={layout.id}
                className={`
                flex items-center space-x-2
                ${
                  isMonthlyCalendar && isSelected
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onLayoutChange(layout.id)}
                  disabled={isMonthlyCalendar && isSelected}
                  className={`
                    rounded border-gray-300 text-blue-600 
                    focus:ring-blue-500
                    ${
                      isMonthlyCalendar && isSelected
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }
                  `}
                />
                <span className="text-sm text-gray-700">
                  {layout.label}
                  {isMonthlyCalendar && isSelected}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      {/* 週記事布局 */}
      <div className="flex space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[5rem]">
          週記事布局
        </label>
        <div className="flex flex-col">
          {weeklyLayouts.map((layout) => (
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
          ))}
        </div>
      </div>
      {/* 日記事布局 */}
      <div className="flex space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[5rem]">
          日記事布局
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
