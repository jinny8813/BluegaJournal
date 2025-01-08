import React from "react";

const WeekStartControl = ({ weekStart, onWeekStartChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
        週起始日
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="monday"
            checked={weekStart === "monday"}
            onChange={(e) => onWeekStartChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">週一</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="sunday"
            checked={weekStart === "sunday"}
            onChange={(e) => onWeekStartChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">週日</span>
        </label>
      </div>
    </div>
  );
};

export default React.memo(WeekStartControl);
