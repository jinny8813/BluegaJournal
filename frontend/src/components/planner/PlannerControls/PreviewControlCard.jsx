import React from "react";

const PreviewControlCard = ({ scale, setScale }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        畫面預覽和下載
      </h2>

      {/* 預覽縮放 */}
      <div className="space-y-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          預覽縮放 ({(scale * 100).toFixed(0)}%)
        </label>
        <input
          type="range"
          min="0.3"
          max="1.5"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* 頁面導航 */}
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
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
            className="w-16 px-2 py-1 border rounded-md text-center"
            min="1"
          />
          <span className="text-gray-600">/ 1</span>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
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

      {/* 下載按鈕 */}
      <button className="w-full px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        下載 PDF
      </button>
    </div>
  );
};

export default PreviewControlCard;
