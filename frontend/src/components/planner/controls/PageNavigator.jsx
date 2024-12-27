import React from "react";

const PageNavigator = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mb-4">
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
          type="number"
          value={currentPage}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              onPageChange(value);
            }
          }}
          className="w-16 px-2 py-1 border rounded-md text-center"
          min="1"
          max={totalPages}
        />
        <span className="text-gray-600">/ {totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={`p-2 rounded-lg transition-colors ${
          currentPage < totalPages
            ? "hover:bg-gray-100 text-gray-700"
            : "text-gray-300 cursor-not-allowed"
        }`}
        disabled={currentPage >= totalPages}
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
  );
};

export default PageNavigator;
