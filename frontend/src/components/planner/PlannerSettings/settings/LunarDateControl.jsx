import React from "react";

const LunarDateControl = ({ lunarDate, onLunarDateChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
        農曆標註
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="off"
            checked={lunarDate === "off"}
            onChange={(e) => onLunarDateChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">不標示</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="on"
            checked={lunarDate === "on"}
            onChange={(e) => onLunarDateChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">標示農曆</span>
        </label>
      </div>
    </div>
  );
};

export default React.memo(LunarDateControl);
