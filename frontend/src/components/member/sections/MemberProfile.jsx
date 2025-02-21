import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/api/authService";

const MemberProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    nickname: "",
    phone: "",
    gender: "",
    birthday: "",
    address: "",
    avatar: null,
  });

  // 取得個人資料
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await authService.getProfile();
      setFormData(profileData);
      setError(null);
    } catch (err) {
      setError("取得個人資料失敗");
      console.error("取得個人資料錯誤:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 處理檔案上傳
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
      });
    }
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 建立 FormData 物件
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // 發送更新請求
      const response = await authService.updateProfile(formDataToSend);

      if (response) {
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      alert("更新失敗");
      console.error("更新個人資料錯誤:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">載入中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-blue-950">個人資料</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
          >
            {isEditing ? "取消" : "編輯"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 電子信箱 (唯讀) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電子信箱
              </label>
              <p className="text-gray-900">{formData.email}</p>
            </div>

            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{formData.name || "-"}</p>
              )}
            </div>

            {/* 暱稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                暱稱
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{formData.nickname || "-"}</p>
              )}
            </div>

            {/* 電話 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{formData.phone || "-"}</p>
              )}
            </div>

            {/* 性別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                性別
              </label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">請選擇</option>
                  <option value="M">男</option>
                  <option value="F">女</option>
                  <option value="O">其他</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {formData.gender === "M"
                    ? "男"
                    : formData.gender === "F"
                    ? "女"
                    : formData.gender === "O"
                    ? "其他"
                    : "-"}
                </p>
              )}
            </div>

            {/* 生日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生日
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.birthday || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{formData.birthday || "-"}</p>
              )}
            </div>

            {/* 地址 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                地址
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{formData.address || "-"}</p>
              )}
            </div>

            {/* 頭像 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                頭像
              </label>
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="頭像"
                  className="w-24 h-24 object-cover rounded-full mb-2"
                />
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberProfile;
