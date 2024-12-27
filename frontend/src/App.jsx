import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./components/common/Layout/MainLayout";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
