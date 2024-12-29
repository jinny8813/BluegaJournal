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
      {/* 月記事布局 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          月記事布局 (必選)
        </label>
        <div className="space-y-2">
          {monthlyLayouts.map((layout) => (
            <label key={layout.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLayouts.monthly.includes(layout.id)}
                onChange={() => onLayoutChange(layout.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={
                  selectedLayouts.monthly.length === 1 &&
                  selectedLayouts.monthly.includes(layout.id)
                }
              />
              <span className="text-sm text-gray-700">{layout.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 週記事布局 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          週記事布局 (選填)
        </label>
        <div className="space-y-2">
          {weeklyLayouts.map((layout) => (
            <label key={layout.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLayouts.weekly.includes(layout.id)}
                onChange={() => onLayoutChange(layout.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{layout.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LayoutSelector);
