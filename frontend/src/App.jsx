import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./components/common/Layout/MainLayout";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { axiosInstance, servicePaths } from "./services/config";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // 發送請求獲取 CSRF cookie
    axiosInstance
      .get(servicePaths.csrf)
      .then(() => {
        console.log("CSRF cookie set");
      })
      .catch((error) => {
        console.error("Error setting CSRF cookie:", error);
      });
  }, []);
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
