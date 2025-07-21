import MainContainer from "./components/MainContainer";
import React, {useEffect} from "react";
import axios from "axios";

const javaUrl = import.meta.env.VITE_BACKEND_URL;
const pythonUrl = import.meta.env.VITE_BACKEND_PYTHON_URL;


function App() {

  useEffect(() => {
    // Send a warm-up request to wake up the backend
    axios.get(`${javaUrl}/ping`, { timeout: 5000 })
      .then(() => console.log("Backend warmed up"))
      .catch((err) => console.warn("Backend warm-up failed:", err));

    axios.get(`${pythonUrl}/ping`, { timeout: 5000 })
      .then(() => console.log("Python Backend warm-up"))
      .catch((err) => console.warn("Python Backend warm-up failed:", err));
  }, []);

  return (
    <div className="min-vh-100">
      <MainContainer/>
    </div>
  );
}

export default App;
