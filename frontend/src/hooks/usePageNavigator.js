import { useState, useRef, useEffect } from "react";

export const usePageNavigator = (totalPages, isDesktop) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);
  const isScrollingRef = useRef(false);

  const scrollContainerRef = isDesktop ? desktopRef : mobileRef;

  // 監控滾動和更新當前頁面
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const calculateCurrentPage = () => {
      // 如果是程式觸發的滾動，不更新頁碼
      if (isScrollingRef.current) return currentPage;

      const pageElements = Array.from(
        container.querySelectorAll("[data-page]")
      );
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const triggerPoint = containerTop + containerHeight / 4; // 使用容器高度的 1/4 作為觸發點

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
      // 如果是程式觸發的滾動，不處理
      if (isScrollingRef.current) return;

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
      scrollRAF = requestAnimationFrame(() => {
        // 只有在不是程式觸發的滾動時才處理
        if (!isScrollingRef.current) {
          handleScroll();
        }
      });
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

    // 設置程式滾動標記
    isScrollingRef.current = true;

    // 計算目標元素的位置並考慮 padding
    const containerPadding = isDesktop ? 64 : container.clientHeight * 0.75;
    const scrollTop = targetElement.offsetTop - containerPadding;

    container.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });

    setCurrentPage(newPage);
    setInputValue(newPage.toString());

    // 在滾動動畫完成後重置程式滾動標記
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000); // 假設滾動動畫時間為 1 秒
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
    desktopRef,
    mobileRef,
    currentPage,
    inputValue,
    handlePageChange,
    handleInputChange,
    handleInputConfirm,
  };
};
