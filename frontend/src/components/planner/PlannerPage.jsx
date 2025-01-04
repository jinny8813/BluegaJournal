import React, { useMemo } from "react";
import { useThemes } from "../../hooks/useThemes";
import { useLayouts } from "../../hooks/useLayouts";
import { useScale } from "../../hooks/useScale";
import { useDateRange } from "../../hooks/useDateRange";
import { usePageNavigator } from "../../hooks/usePageNavigator";
import { useOrientation } from "../../hooks/useOrientation";
import { useLanguage } from "../../hooks/useLanguage";
import PlannerPreviews from "./PlannerPreviews/PlannerPreviews";
import PlannerControls from "./PlannerControls/PlannerControls";

const PlannerPage = () => {
  const { orientation, handleOrientationChange } = useOrientation();
  const { language, handleLanguageChange } = useLanguage();

  const {
    contents,
    layouts,
    selectedLayouts,
    loading: layoutsLoading,
    error: layoutsError,
    handleLayoutChange,
    getOrderedLayouts,
  } = useLayouts(orientation); // 傳入 orientation

  const {
    themes,
    currentTheme,
    loading: themesLoading,
    error: themesError,
    handleThemeChange,
  } = useThemes();

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

  // 生成預覽頁面配置
  const previewPages = useMemo(() => {
    if (!layouts?.layouts) return [];

    const pages = [];
    const orderedLayouts = getOrderedLayouts();

    // 處理月記事布局
    orderedLayouts.forEach((layout) => {
      if (layout.type === "monthly") {
        const monthlyDates = getMonthlyDates();
        monthlyDates.forEach((date) => {
          pages.push({
            ...layout,
            pageNumber: pages.length + 1,
            title: getMonthlyTitle(date, layout.coverTitle),
          });
        });
      } else if (layout.type === "weekly") {
        const weeklyDates = getWeeklyDates();
        weeklyDates.forEach((date) => {
          pages.push({
            ...layout,
            pageNumber: pages.length + 1,
            title: getWeeklyTitle(date, layout.coverTitle),
          });
        });
      }
    });

    return pages;
  }, [
    layouts,
    getOrderedLayouts,
    getMonthlyDates,
    getWeeklyDates,
    getMonthlyTitle,
    getWeeklyTitle,
  ]);

  // 計算總頁數
  const totalPages = previewPages.length;

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
    <div className="flex h-[calc(100vh-7.25rem)]">
      <div
        className="w-3/4 p-8 overflow-auto"
        style={{ backgroundColor: "#C5C5C5", scrollBehavior: "smooth" }}
        ref={scrollContainerRef}
      >
        <PlannerPreviews
          contents={contents}
          layouts={layouts}
          previewPages={previewPages}
          currentTheme={currentTheme}
          scale={scale}
          currentPage={currentPage}
          language={language}
        />
      </div>

      <div
        className="w-1/4 p-4 overflow-auto"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <PlannerControls
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
          currentPage={currentPage}
          totalPages={totalPages}
          inputValue={inputValue}
          onPageChange={handlePageChange}
          onInputChange={handleInputChange}
          onInputConfirm={handleInputConfirm}
          onDownload={handleDownload}
          orientation={orientation}
          onOrientationChange={handleOrientationChange}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default PlannerPage;
