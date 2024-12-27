import React from "react";

const PlannerPreviews = ({ scale }) => {
  return (
    <div className="h-full flex flex-col">
      {/* 預覽容器 - 使用 flex 置中 */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        {/* A4 紙張預覽 */}
        <div
          className="bg-white shadow-lg rounded-lg"
          style={{
            width: `${595 * scale}px`, // A4 寬度 (點)
            height: `${842 * scale}px`, // A4 高度 (點)
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {/* 紙張內容 */}
          <div className="p-8">
            <div className="border-b border-gray-300 pb-4 mb-4">
              <h3 className="text-xl font-semibold text-black">2024 年 1 月</h3>
            </div>

            {/* 日曆表格 */}
            <div className="grid grid-cols-7 gap-2 text-center text-black">
              <div className="text-red-500">日</div>
              <div>一</div>
              <div>二</div>
              <div>三</div>
              <div>四</div>
              <div>五</div>
              <div className="text-red-500">六</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerPreviews;
