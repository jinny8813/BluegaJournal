import React from "react";
import DateControl from "./controls/DateControl";
import LayoutSelector from "./controls/LayoutSelector";
import ThemeSelector from "./controls/ThemeSelector";
import ScaleControl from "./controls/ScaleControl";
import PageNavigator from "./controls/PageNavigator";
import OrientationControl from "./controls/OrientationControl";

const PlannerControls = ({
  startDate,
  duration,
  selectedLayouts,
  layouts,
  currentTheme,
  themes,
  scale,
  onDateChange,
  onDurationChange,
  onLayoutChange,
  onThemeChange,
  onScaleChange,
  onDownload,
  isLoading,
  currentPage,
  totalPages,
  inputValue,
  onPageChange,
  onInputChange,
  onInputConfirm,
  orientation,
  onOrientationChange,
}) => {
  return (
    <div className="space-y-4">
      {/* 版面方向選擇 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          版面方向選擇
        </h2>
        <div className="space-y-6">
          <OrientationControl
            orientation={orientation}
            onOrientationChange={onOrientationChange}
          />
        </div>
      </div>

      {/* 手帳配置設定 Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          手帳配置設定
        </h2>

        <div className="space-y-6">
          <DateControl
            startDate={startDate}
            duration={duration}
            onDateChange={onDateChange}
            onDurationChange={onDurationChange}
          />

          <LayoutSelector
            selectedLayouts={selectedLayouts}
            onLayoutChange={onLayoutChange}
            layouts={layouts}
          />

          <ThemeSelector
            currentTheme={currentTheme}
            themes={themes}
            onThemeChange={onThemeChange}
          />
        </div>
      </div>

      {/* 畫面預覽和下載 Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          畫面預覽和下載
        </h2>

        <ScaleControl scale={scale} onScaleChange={onScaleChange} />

        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          inputValue={inputValue}
          onPageChange={onPageChange}
          onInputChange={onInputChange}
          onInputConfirm={onInputConfirm}
        />

        <button
          onClick={onDownload}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors my-4
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              生成中...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              下載 PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PlannerControls;
