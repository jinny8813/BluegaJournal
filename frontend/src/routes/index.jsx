import { Routes, Route } from "react-router-dom";
import HomePage from "../components/home/HomePage";
import AuthPage from "../components/auth/AuthPage";
import PlannerPage from "../components/planner/PlannerPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* 其他路由 */}
    </Routes>
  );
};

export default AppRoutes;
