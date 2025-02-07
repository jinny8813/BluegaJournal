import React from "react";

const DateControl = ({
  startDate,
  duration,
  onDateChange,
  onDurationChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
          起始日期
        </label>
        <input
          type="month"
          value={startDate.toISOString().slice(0, 7)}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
            持續月數
          </label>
          <select
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          >
            {[3, 6, 9, 12].map((months) => (
              <option key={months} value={months}>
                {months} 個月
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-red-500 mt-2">
          - 注意: 持續月數越多，生成時間越長(多幾秒)
        </p>
      </div>
    </div>
  );
};

export default DateControl;
