import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MemberProfile from "./sections/MemberProfile";
import MemberPlanner from "./sections/MemberPlanner";
import MemberFlashcard from "./sections/MemberFlashcard";

const MENU_ITEMS = [
  {
    key: "profile",
    label: "會員資料",
    icon: "fa-solid fa-user",
  },
  {
    key: "planner",
    label: "我的手帳",
    icon: "fa-solid fa-calendar-days",
  },
  {
    key: "flashcard",
    label: "我的單字卡",
    icon: "fa-solid fa-layer-group",
  },
  {
    key: "settings",
    label: "帳號設定",
    icon: "fa-solid fa-gear",
  },
];

const MemberPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <MemberProfile />;
      case "planner":
        return <MemberPlanner />;
      case "flashcard":
        return <MemberFlashcard />;
      case "settings":
        return <div>帳號設定頁面</div>;
      default:
        return <MemberProfile />;
    }
  };

  return (
    <div className="flex h-[calc(100dvh-6rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-blue-950">會員中心</h2>
        </div>
        <nav className="mt-4">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full px-4 py-3 flex items-center space-x-3 text-left
                ${
                  activeTab === item.key
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MemberPage;
