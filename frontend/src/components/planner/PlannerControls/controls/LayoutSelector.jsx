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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-4">
          {/* 月記事布局 */}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 py-2">
              月記事布局
            </label>
            {monthlyLayouts.map((layout) => {
              const isSelected = selectedLayouts.myLayouts.includes(layout.id);
              const isMonthlyCalender = layout.id === "monthly_calender";

              return (
                <label key={layout.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onLayoutChange(layout.id)}
                    disabled={isMonthlyCalender && isSelected}
                    className={`
                    rounded border-gray-300 text-blue-600 
                    focus:ring-blue-500
                    ${
                      isMonthlyCalender && isSelected
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }
                  `}
                  />
                  <span className="text-sm text-gray-700">
                    {layout.label}
                    {isMonthlyCalender && isSelected}
                  </span>
                </label>
              );
            })}
          </div>
          {/* 週記事布局 */}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 py-2">
              週記事布局
            </label>
            {weeklyLayouts.map((layout) => (
              <label key={layout.id} className="flex items-center space-x-2">
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
      </div>
    </div>
  );
};

export default React.memo(LayoutSelector);
