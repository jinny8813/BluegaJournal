import React from "react";

const OrientationControl = ({ orientation, onOrientationChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700 min-w-[5rem]">
        版面方向
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="horizontal"
            checked={orientation === "horizontal"}
            onChange={(e) => onOrientationChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">橫式</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="vertical"
            checked={orientation === "vertical"}
            onChange={(e) => onOrientationChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">直式</span>
        </label>
      </div>
    </div>
  );
};

export default React.memo(OrientationControl);
