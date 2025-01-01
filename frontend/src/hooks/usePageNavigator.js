import { useState, useRef, useEffect } from "react";

export const usePageNavigator = (totalPages) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const scrollContainerRef = useRef(null);

  // 監控滾動和更新當前頁面
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const calculateCurrentPage = () => {
      const pageElements = Array.from(
        container.querySelectorAll("[data-page]")
      );
      const containerRect = container.getBoundingClientRect();
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const triggerPoint = containerTop + containerHeight / 3; // 使用容器高度的 1/3 作為觸發點

      // 找到最接近觸發點的頁面
      let closestPage = 1;
      let minDistance = Infinity;

      pageElements.forEach((element) => {
        const elementTop = element.offsetTop;
        const distance = Math.abs(elementTop - triggerPoint);

        if (distance < minDistance) {
          minDistance = distance;
          closestPage = parseInt(element.dataset.page);
        }
      });

      return closestPage;
    };

    const handleScroll = () => {
      const newPage = calculateCurrentPage();
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
        setInputValue(newPage.toString());
      }
    };

    // 使用 requestAnimationFrame 來優化滾動效能
    let scrollRAF;
    const debouncedScroll = () => {
      if (scrollRAF) {
        cancelAnimationFrame(scrollRAF);
      }
      scrollRAF = requestAnimationFrame(handleScroll);
    };

    container.addEventListener("scroll", debouncedScroll);

    // 初始計算當前頁面
    handleScroll();

    return () => {
      container.removeEventListener("scroll", debouncedScroll);
      if (scrollRAF) {
        cancelAnimationFrame(scrollRAF);
      }
    };
  }, [currentPage]); // 添加 currentPage 作為依賴

  // 處理頁面變更
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const targetElement = container.querySelector(`[data-page="${newPage}"]`);
    if (!targetElement) return;

    // 計算目標元素的位置並考慮 padding
    const containerPadding = 32; // 8 * 4 = 32px (p-8)
    const scrollTop = targetElement.offsetTop - containerPadding;

    container.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });

    setCurrentPage(newPage);
    setInputValue(newPage.toString());
  };

  // 處理輸入框變更
  const handleInputChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setInputValue(numericValue);
  };

  // 處理輸入確認
  const handleInputConfirm = () => {
    const numericValue = parseInt(inputValue);
    if (
      !isNaN(numericValue) &&
      numericValue >= 1 &&
      numericValue <= totalPages
    ) {
      handlePageChange(numericValue);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return {
    scrollContainerRef,
    currentPage,
    inputValue,
    handlePageChange,
    handleInputChange,
    handleInputConfirm,
  };
};
