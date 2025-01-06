import React from "react";
import DateControl from "./settings/DateControl";
import LayoutSelector from "./settings/LayoutSelector";
import ThemeSelector from "./settings/ThemeSelector";
import OrientationControl from "./settings/OrientationControl";
import LanguageControl from "./settings/LanguageControl";

const PlannerControls = ({
  startDate,
  duration,
  selectedLayouts,
  layouts,
  currentTheme,
  themes,
  onDateChange,
  onDurationChange,
  onLayoutChange,
  onThemeChange,
  orientation,
  onOrientationChange,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 手帳配置設置 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          手帳配置設置
        </h2>
        <div className="space-y-6">
          <ThemeSelector
            currentTheme={currentTheme}
            themes={themes}
            onThemeChange={onThemeChange}
          />
          <LanguageControl
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>

      {/* 日期區間設置 Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          日期區間設置
        </h2>
        <div className="space-y-6">
          <DateControl
            startDate={startDate}
            duration={duration}
            onDateChange={onDateChange}
            onDurationChange={onDurationChange}
          />
        </div>
      </div>

      {/* 手帳版面設置 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          手帳版面設置
        </h2>
        <div className="space-y-6">
          <OrientationControl
            orientation={orientation}
            onOrientationChange={onOrientationChange}
          />
          <LayoutSelector
            selectedLayouts={selectedLayouts}
            onLayoutChange={onLayoutChange}
            layouts={layouts}
          />
        </div>
      </div>
    </div>
  );
};

export default PlannerControls;
