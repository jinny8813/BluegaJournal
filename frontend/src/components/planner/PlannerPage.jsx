import React from "react";
import PlannerPreviews from "./PlannerPreviews/PlannerPreviews";
import PlannerControls from "./PlannerControls/PlannerControls";
import { usePlannerState } from "../../hooks/usePlannerState";
import { useThemes } from "../../hooks/useThemes";
import { useLayouts } from "../../hooks/useLayouts";
import { useScale } from "../../hooks/useScale";
import { useDateRange } from "../../hooks/useDateRange";

const PlannerPage = () => {
  const { currentPage, totalPages, scrollContainerRef, handlePageChange } =
    usePlannerState();

  const {
    themes,
    currentTheme,
    loading: themesLoading,
    error: themesError,
    handleThemeChange,
  } = useThemes();

  const {
    layouts,
    selectedLayouts,
    getOrderedLayouts,
    loading: layoutsLoading,
    error: layoutsError,
    handleLayoutChange,
  } = useLayouts();

  const { scale, handleScaleChange } = useScale();

  const {
    startDate,
    duration,
    handleDateChange,
    handleDurationChange,
    getMonthlyTitle,
    getWeeklyTitle,
    getMonthlyDates,
    getWeeklyDates,
  } = useDateRange();

  // 處理加載狀態
  if (layoutsLoading || themesLoading) {
    return <div>Loading...</div>;
  }

  // 處理錯誤狀態
  if (layoutsError || themesError) {
    return <div>Error: {layoutsError || themesError}</div>;
  }

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
          layouts={layouts}
          getOrderedLayouts={getOrderedLayouts}
          currentTheme={currentTheme}
          scale={scale}
          scrollContainerRef={scrollContainerRef}
          getMonthlyTitle={getMonthlyTitle}
          getWeeklyTitle={getWeeklyTitle}
          getMonthlyDates={getMonthlyDates}
          getWeeklyDates={getWeeklyDates}
        />
      </div>

      <div
        className="w-1/4 p-4 overflow-auto pb-24"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <PlannerControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onDownload={handleDownload}
          themes={themes}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          layouts={layouts}
          selectedLayouts={selectedLayouts}
          onLayoutChange={handleLayoutChange}
          scale={scale}
          onScaleChange={handleScaleChange}
          startDate={startDate}
          duration={duration}
          onDateChange={handleDateChange}
          onDurationChange={handleDurationChange}
        />
      </div>
    </div>
  );
};

export default PlannerPage;
