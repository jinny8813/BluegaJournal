import { useState, useRef, useCallback } from "react";

export const usePageNavigation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);
  const scrollContainerRef = useRef(null);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        const pageElement = document.querySelector(`[data-page="${newPage}"]`);
        if (pageElement && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: pageElement.offsetTop,
            behavior: "smooth",
          });
        }
      }
    },
    [totalPages]
  );

  return {
    currentPage,
    totalPages,
    scale,
    setScale,
    scrollContainerRef,
    handlePageChange,
    setTotalPages,
  };
};
