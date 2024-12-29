import React from "react";

const ThemeSelector = ({ currentTheme, themes, onThemeChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        背景主題
      </label>
      <div className="flex gap-2">
        {Object.values(themes).map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme)}
            className={`relative rounded-lg transition-all ${
              currentTheme.id === theme.id
                ? "ring-2 ring-blue-500 ring-offset-2"
                : "hover:ring-2 hover:ring-gray-300"
            }`}
            style={{
              backgroundColor: theme.styles.background,
              width: "40px",
              height: "40px",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
            title={theme.label}
          >
            {currentTheme.id === theme.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.styles.text }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
