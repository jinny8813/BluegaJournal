import React from "react";

const ScaleControl = ({ scale, onScaleChange }) => {
  return (
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
        onChange={(e) => onScaleChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default ScaleControl;
