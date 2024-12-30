import React from "react";

const DateControl = ({
  startDate,
  duration,
  onDateChange,
  onDurationChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          起始日期
        </label>
        <input
          type="month"
          value={startDate.toISOString().slice(0, 7)}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          月數 ({duration} 個月)
        </label>
        <select
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
        >
          {[3, 6, 9, 12, 15, 18].map((months) => (
            <option key={months} value={months}>
              {months} 個月
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateControl;
