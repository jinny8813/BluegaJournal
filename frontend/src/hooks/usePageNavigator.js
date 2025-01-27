import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export const usePageNavigator = (totalPages, { scale, layouts }, isDesktop) => {
  // 基本狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  // refs
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);
  const isScrollingRef = useRef(false);

  const scrollContainerRef = isDesktop ? desktopRef : mobileRef;

  // 使用 useMemo 來計算 estimateSize
  const estimateSize = useMemo(() => {
    return () => layouts.page_config.height * scale + 16;
  }, [layouts, scale]);

  // 虛擬化設置
  const rowVirtualizer = useVirtualizer({
    count: totalPages,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize,
    overscan: 5,
  });

  // scale 改變時重新計算所有項目的大小
  useEffect(() => {
    rowVirtualizer.measure();
  }, [scale, layouts]);

  // 監聽滾動事件來偵測當前頁面
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const detectCurrentPage = () => {
      if (isScrollingRef.current) return;

      // 計算容器的 1/4 位置
      const quarterPoint = container.scrollTop + container.clientHeight * 0.25;

      // 獲取所有可見的虛擬項目
      const virtualItems = rowVirtualizer.getVirtualItems();

      // 找出在 1/4 位置的項目
      const currentItem = virtualItems.find((item) => {
        const itemTop = item.start;
        const itemBottom = item.end;
        return quarterPoint >= itemTop && quarterPoint <= itemBottom;
      });

      if (currentItem) {
        const newPage = currentItem.index + 1;
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
          setInputValue(newPage.toString());
        }
      }
    };

    // 添加滾動事件監聽器
    const handleScroll = () => {
      requestAnimationFrame(detectCurrentPage);
    };

    container.addEventListener("scroll", handleScroll);

    // 初始檢測
    detectCurrentPage();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef.current, rowVirtualizer]);

  // 處理頁面跳轉
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages || !scrollContainerRef.current)
        return;

      isScrollingRef.current = true;

      const virtualItem = rowVirtualizer
        .getVirtualItems()
        .find((item) => item.index === newPage - 1);

      if (virtualItem) {
        scrollContainerRef.current.scrollTo({
          top: virtualItem.start,
          behavior: "smooth",
        });
      }

      setCurrentPage(newPage);
      setInputValue(newPage.toString());

      // 重置滾動標記
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    },
    [totalPages, rowVirtualizer]
  );

  // 處理輸入框變更
  const handleInputChange = useCallback((value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setInputValue(numericValue);
  }, []);

  // 處理輸入確認
  const handleInputConfirm = useCallback(() => {
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
  }, [inputValue, currentPage, totalPages, handlePageChange]);

  return {
    desktopRef,
    mobileRef,
    currentPage,
    inputValue,
    handlePageChange,
    handleInputChange,
    handleInputConfirm,
    rowVirtualizer,
  };
};
