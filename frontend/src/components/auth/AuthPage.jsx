import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api/authService";
import { useAuth } from "../../contexts/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 登入
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // 註冊
        if (formData.password !== formData.confirmPassword) {
          throw new Error("密碼不匹配");
        }
        const response = await authService.register({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          name: formData.name,
        });
        console.log("Registration successful:", response);
        // 註冊成功後自動登入
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/");
    } catch (error) {
      let errorMessage = "發生錯誤，請稍後再試";
      if (error.response) {
        // 處理後端返回的錯誤訊息
        const data = error.response.data;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.email) {
          errorMessage = `電子郵件: ${data.email[0]}`;
        } else if (data.password) {
          errorMessage = `密碼: ${data.password[0]}`;
        } else if (data.name) {
          errorMessage = `姓名: ${data.name[0]}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full h-[calc(100dvh-6rem)] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-950">
            {isLogin ? "登入" : "註冊"}
          </h2>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              電子郵件
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              密碼
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                確認密碼
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                處理中...
              </span>
            ) : (
              <span>{isLogin ? "登入" : "註冊"}</span>
            )}
          </button>
        </form>

        {/* 切換登入/註冊 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isLogin ? "還沒有帳號？點此註冊" : "已有帳號？點此登入"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
