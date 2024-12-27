import { Routes, Route } from "react-router-dom";
import HomePage from "../components/home/HomePage";
import PlannerPage from "../components/planner/PlannerPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/planner" element={<PlannerPage />} />
      {/* 其他路由 */}
    </Routes>
  );
};

export default AppRoutes;
