import { useState, useRef, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export const usePageNavigator = (totalPages, { scale, layouts }, isDesktop) => {
  const [currentPage, setCurrentPage] = useState(1); // 當前頁碼
  const [inputValue, setInputValue] = useState("1"); // 輸入框的值
  const desktopRef = useRef(null); // 桌面容器
  const mobileRef = useRef(null); // 移動容器
  const observerRef = useRef(null); // Intersection Observer 的參考
  const visiblePages = useRef(new Set()); // 儲存當前可見的頁面

  const scrollContainerRef = isDesktop ? desktopRef : mobileRef; // 根據設備選擇容器

  // 初始化 rowVirtualizer
  const rowVirtualizer = useVirtualizer({
    count: totalPages, // 總頁數
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => layouts.page_config.height * scale + 16, // 預估每個項目的高度（包括間距）
    overscan: 5, // 額外渲染範圍
  });

  // 用於監測每個虛擬項目的 Intersection Observer
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // 初始化 Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageIndex = parseInt(entry.target.dataset.page, 10);

          if (entry.isIntersecting) {
            // 如果元素進入視窗，加入可見頁面的集合
            visiblePages.current.add(pageIndex);
          } else {
            // 如果元素離開視窗，從集合中移除
            visiblePages.current.delete(pageIndex);
          }
        });

        // 更新當前頁碼為可見頁面的最小值
        const visiblePagesArray = Array.from(visiblePages.current);
        if (visiblePagesArray.length > 0) {
          const newPage = Math.min(...visiblePagesArray) + 1;
          setCurrentPage(newPage);
          setInputValue(newPage.toString());
        }
      },
      {
        root: scrollContainerRef.current, // 監測的滾動容器
        threshold: 0.5, // 元素至少有 50% 可見時觸發
      }
    );

    // 監測虛擬項目
    const virtualItems = rowVirtualizer.getVirtualItems();
    virtualItems.forEach((item) => {
      const element = document.querySelector(`[data-page="${item.index}"]`);
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      // 清理 Intersection Observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [rowVirtualizer]);

  // 處理頁面跳轉
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const container = scrollContainerRef.current;
    if (!container || !rowVirtualizer) return;

    // 找到對應的虛擬項目
    const virtualItem = rowVirtualizer
      .getVirtualItems()
      .find((item) => item.index === newPage - 1);
    if (!virtualItem) return;

    // 滾動到目標位置
    container.scrollTo({
      top: virtualItem.start,
      behavior: "smooth",
    });

    setCurrentPage(newPage);
    setInputValue(newPage.toString());
  };

  // 處理輸入框變更
  const handleInputChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // 過濾非數字字符
    setInputValue(numericValue);
  };

  // 處理輸入框確認
  const handleInputConfirm = () => {
    const numericValue = parseInt(inputValue);
    if (
      !isNaN(numericValue) &&
      numericValue >= 1 &&
      numericValue <= totalPages
    ) {
      handlePageChange(numericValue);
    } else {
      setInputValue(currentPage.toString()); // 如果輸入無效，重置為當前頁碼
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
    rowVirtualizer,
  };
};
