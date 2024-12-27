import React from "react";
import PlannerPreviews from "./PlannerPreviews/PlannerPreviews";
import PlannerControls from "./PlannerControls/PlannerControls";
import { usePlannerState } from "../../hooks/usePlannerState";
import { themeConfig } from "../../config/themes";

const PlannerPage = () => {
  const {
    startDate,
    duration,
    selectedLayouts,
    currentTheme,
    scale,
    currentPage,
    totalPages,
    scrollContainerRef,
    handleDateChange,
    handleDurationChange,
    handleLayoutChange,
    setCurrentTheme,
    setScale,
    handlePageChange,
  } = usePlannerState();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // 實現下載邏輯
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7.25rem)]">
      <div
        className="w-3/4 overflow-auto"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <PlannerPreviews
          scale={scale}
          scrollContainerRef={scrollContainerRef}
          pages={[]} // 需要實現頁面生成邏輯
          currentTheme={currentTheme}
        />
      </div>

      <div
        className="w-1/4 p-4 overflow-auto pb-24"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <PlannerControls
          startDate={startDate}
          duration={duration}
          selectedLayouts={selectedLayouts}
          currentTheme={currentTheme}
          themes={themeConfig.themes}
          scale={scale}
          currentPage={currentPage}
          totalPages={totalPages}
          onDateChange={handleDateChange}
          onDurationChange={handleDurationChange}
          onLayoutChange={handleLayoutChange}
          onThemeChange={setCurrentTheme}
          onScaleChange={setScale}
          onPageChange={handlePageChange}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PlannerPage;
