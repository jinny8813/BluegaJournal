import React from "react";

const HolidaysControl = ({ holidays, onHolidaysChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700 min-w-[4rem]">
        節日假日
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="false"
            checked={holidays === "false"}
            onChange={(e) => onHolidaysChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">不標示</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="true"
            checked={holidays === "true"}
            onChange={(e) => onHolidaysChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">標示節日假日</span>
        </label>
      </div>
    </div>
  );
};

export default React.memo(HolidaysControl);
