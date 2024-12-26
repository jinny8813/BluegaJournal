// frontend/src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/hello/`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}

export default App;
