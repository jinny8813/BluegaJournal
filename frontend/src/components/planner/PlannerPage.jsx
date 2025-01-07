import React from "react";
import { useThemes } from "../../hooks/useThemes";
import { useLayouts } from "../../hooks/useLayouts";
import { useScale } from "../../hooks/useScale";
import { useDateRange } from "../../hooks/useDateRange";
import { usePageNavigator } from "../../hooks/usePageNavigator";
import { useOrientation } from "../../hooks/useOrientation";
import { useLanguage } from "../../hooks/useLanguage";
import { useWeekStart } from "../../hooks/useWeekStart";
import { usePageConfiguration } from "../../hooks/usePageConfig";
import PlannerPreviews from "./PlannerPreviews/PlannerPreviews";
import PlannerSettings from "./PlannerSettings/PlannerSettings";
import PlannerControls from "./PlannerControls/PlannerControls";

const PlannerPage = () => {
  const { orientation, handleOrientationChange } = useOrientation();
  const { language, handleLanguageChange } = useLanguage();
  const { weekStart, handleWeekStartChange } = useWeekStart();

  const {
    contents,
    layouts,
    selectedLayouts,
    loading: layoutsLoading,
    error: layoutsError,
    handleLayoutChange,
  } = useLayouts(orientation); // 傳入 orientation

  const {
    themes,
    currentTheme,
    loading: themesLoading,
    error: themesError,
    handleThemeChange,
  } = useThemes();

  const { scale, handleScaleChange } = useScale();

  const { startDate, duration, handleDateChange, handleDurationChange } =
    useDateRange();

  // 生成預覽頁面配置
  const {
    pages,
    getPageByNumber,
    getPagesByDate,
    getPagesByLayoutType,
    getPagesByType,
    getFirstContentPage,
    getMonthlyPages,
    getWeeklyPages,
    createPageLink,
    getTableOfContents,
    getAdjacentPages,
    getTotalPages,
  } = usePageConfiguration({
    layouts,
    selectedLayouts,
    startDate,
    duration,
    weekStart,
  });

  const totalPages = getTotalPages();

  const {
    scrollContainerRef,
    currentPage,
    inputValue,
    handlePageChange,
    handleInputChange,
    handleInputConfirm,
  } = usePageNavigator(totalPages);

  // 處理加載狀態
  if (layoutsLoading || themesLoading) {
    return <div>Loading...</div>;
  }

  // 處理錯誤狀態
  if (layoutsError || themesError) {
    return <div>Error: {layoutsError || themesError}</div>;
  }

  const handleDownload = () => {
    console.log("download");
  };

  return (
    <>
      <div className="hidden lg:flex lg:flex-row lg:h-[calc(100dvh-6rem)]">
        <div className="lg:w-1/3 lg:h-auto lg:flex lg:flex-col">
          <div
            className="overflow-auto bg-gray-200 lg:p-4"
            style={{ scrollBehavior: "smooth" }}
          >
            <PlannerSettings
              themes={themes}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              layouts={layouts}
              selectedLayouts={selectedLayouts}
              onLayoutChange={handleLayoutChange}
              startDate={startDate}
              duration={duration}
              onDateChange={handleDateChange}
              onDurationChange={handleDurationChange}
              orientation={orientation}
              onOrientationChange={handleOrientationChange}
              language={language}
              onLanguageChange={handleLanguageChange}
              weekStart={weekStart}
              onWeekStartChange={handleWeekStartChange}
            />
          </div>
          <div
            className="overflow-auto bg-gray-100 lg:p-4 min-h-[calc(32dvh-4rem)]"
            style={{ scrollBehavior: "smooth" }}
          >
            <PlannerControls
              scale={scale}
              onScaleChange={handleScaleChange}
              currentPage={currentPage}
              totalPages={totalPages}
              inputValue={inputValue}
              onPageChange={handlePageChange}
              onInputChange={handleInputChange}
              onInputConfirm={handleInputConfirm}
              onDownload={handleDownload}
            />
          </div>
        </div>
        <div
          className="overflow-auto bg-gray-300 lg:w-2/3 lg:h-auto"
          style={{ scrollBehavior: "smooth" }}
          ref={scrollContainerRef}
        >
          <PlannerPreviews
            contents={contents}
            layouts={layouts}
            allPages={pages}
            currentTheme={currentTheme}
            scale={scale}
            language={language}
            orientation={orientation}
            weekStart={weekStart}
          />
        </div>
      </div>

      <div className="flex flex-col h-[calc(100dvh-6rem)] lg:hidden">
        <div
          className="overflow-auto bg-gray-100 p-2 h-[calc(36dvh-4rem)]"
          style={{ scrollBehavior: "smooth" }}
        >
          <PlannerSettings
            themes={themes}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            layouts={layouts}
            selectedLayouts={selectedLayouts}
            onLayoutChange={handleLayoutChange}
            startDate={startDate}
            duration={duration}
            onDateChange={handleDateChange}
            onDurationChange={handleDurationChange}
            orientation={orientation}
            onOrientationChange={handleOrientationChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            weekStart={weekStart}
            onWeekStartChange={handleWeekStartChange}
          />
        </div>
        <div
          className="overflow-auto bg-gray-300 h-[calc(48dvh)]"
          style={{ scrollBehavior: "smooth" }}
          ref={scrollContainerRef}
        >
          <PlannerPreviews
            contents={contents}
            layouts={layouts}
            allPages={pages}
            currentTheme={currentTheme}
            scale={scale}
            language={language}
            orientation={orientation}
            weekStart={weekStart}
          />
        </div>
        <div
          className="overflow-auto bg-gray-200 p-2 h-[calc(16dvh-2rem)]"
          style={{ scrollBehavior: "smooth" }}
        >
          <PlannerControls
            scale={scale}
            onScaleChange={handleScaleChange}
            currentPage={currentPage}
            totalPages={totalPages}
            inputValue={inputValue}
            onPageChange={handlePageChange}
            onInputChange={handleInputChange}
            onInputConfirm={handleInputConfirm}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </>
  );
};

export default PlannerPage;
