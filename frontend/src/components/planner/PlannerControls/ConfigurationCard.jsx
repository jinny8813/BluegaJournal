import React from "react";

const ConfigurationCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">手帳配置設定</h2>

      <div className="space-y-4">
        {/* 起始日期設定 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            起始日期
          </label>
          <input
            type="month"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 月數設定 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            月數
          </label>
          <select className="w-full px-3 py-2 border rounded-md">
            {[3, 6, 9, 12, 15, 18].map((months) => (
              <option key={months} value={months}>
                {months} 個月
              </option>
            ))}
          </select>
        </div>

        {/* 布局選擇器 */}
        <div className="space-y-4">
          {/* 月記事布局 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              月記事布局 (必選)
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">月曆視圖</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">月記事本</span>
              </label>
            </div>
          </div>

          {/* 週記事布局 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              週記事布局 (選填)
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">週計畫表</span>
              </label>
            </div>
          </div>
        </div>

        {/* 背景主題選擇 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            背景主題
          </label>
          <div className="flex gap-2">
            {["#FFFFFF", "#F3F4F6", "#E5E7EB", "#D1D5DB"].map((color) => (
              <button
                key={color}
                className="w-10 h-10 rounded-lg border transition-all hover:ring-2 hover:ring-blue-500"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationCard;
