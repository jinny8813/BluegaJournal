import React from "react";

const LanguageControl = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700 min-w-[5rem]">
        語言
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="en"
            checked={language === "en"}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">英文</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="zh"
            checked={language === "zh"}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">中文</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="both"
            checked={language === "both"}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">雙語</span>
        </label>
      </div>
    </div>
  );
};

export default React.memo(LanguageControl);
