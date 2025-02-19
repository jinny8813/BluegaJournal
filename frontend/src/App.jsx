import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./components/common/Layout/MainLayout";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
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
