import React from "react";

const OrientationControl = ({ orientation, onOrientationChange }) => {
  return (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">
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
          <span className="ml-2">橫式</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="vertical"
            checked={orientation === "vertical"}
            onChange={(e) => onOrientationChange(e.target.value)}
            className="form-radio text-blue-600"
          />
          <span className="ml-2">直式</span>
        </label>
      </div>
    </div>
  );
};

export default React.memo(OrientationControl);
