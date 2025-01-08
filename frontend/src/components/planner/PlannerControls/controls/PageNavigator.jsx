import React from "react";

const PageNavigator = ({
  currentPage,
  totalPages,
  inputValue,
  onPageChange,
  onInputChange,
  onInputConfirm,
}) => {
  // 確保 totalPages 至少為 1
  const safeTotalPages = Math.max(1, totalPages || 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[6rem]">
          頁面 (p.{currentPage})
        </label>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className={`p-2 rounded-lg transition-colors ${
              currentPage > 1
                ? "hover:bg-gray-100 text-gray-700"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={currentPage <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue || ""}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onInputConfirm();
                }
              }}
              onBlur={onInputConfirm}
              className="w-16 px-2 py-1 border rounded-md text-center"
            />
            <span className="text-gray-600">/ {safeTotalPages}</span>
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            className={`p-2 rounded-lg transition-colors ${
              currentPage < safeTotalPages
                ? "hover:bg-gray-100 text-gray-700"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={currentPage >= safeTotalPages}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PageNavigator);
