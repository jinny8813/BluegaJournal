/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/__mocks__/svgMock.js", // 添加 SVG mock
    "^/vite\\.svg$": "<rootDir>/__mocks__/svgMock.js", // 處理 vite.svg
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-react"] },
    ],
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
  ],
};

export default config;
