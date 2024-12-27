import React from "react";

const LayoutSelector = ({ selectedLayouts, onLayoutChange }) => {
  return (
    <div className="space-y-4">
      {/* 月記事布局 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          月記事布局 (必選)
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedLayouts.monthly.includes("monthly-calendar")}
              onChange={() => onLayoutChange("monthly-calendar", "monthly")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={
                selectedLayouts.monthly.length === 1 &&
                selectedLayouts.monthly.includes("monthly-calendar")
              }
            />
            <span className="text-sm text-gray-700">月曆視圖</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedLayouts.monthly.includes("monthly-notes")}
              onChange={() => onLayoutChange("monthly-notes", "monthly")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">月記事本</span>
          </label>
        </div>
      </div>

      {/* 週記事布局 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          週記事布局 (選填)
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedLayouts.weekly.includes("weekly-planner")}
              onChange={() => onLayoutChange("weekly-planner", "weekly")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">週計畫表</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LayoutSelector;
