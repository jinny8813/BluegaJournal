import { Routes, Route } from "react-router-dom";
import HomePage from "../components/home/HomePage";
import AuthPage from "../components/auth/AuthPage";
import PlannerPage from "../components/planner/PlannerPage";
// import MemberPage from "../components/member/MemberPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 公開路由 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* 需要登入的路由 */}
      {/* <Route
        path="/member"
        element={
          <ProtectedRoute>
            <MemberPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      /> */}

      {/* 半保護路由（可以瀏覽，但某些功能需要登入） */}
      <Route path="/planner" element={<PlannerPage />} />
    </Routes>
  );
};

export default AppRoutes;
