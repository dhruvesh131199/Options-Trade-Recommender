import MainContainer from "./components/MainContainer";
import React, {useEffect} from "react";
import axios from "axios";

const javaUrl = import.meta.env.VITE_BACKEND_URL;
const pythonUrl = import.meta.env.VITE_BACKEND_PYTHON_URL;

function wakeBackend(url, label) {
  const ping = () =>
    axios.get(`${url}/ping`, { timeout: 90000 }).then(() => {
      console.log(`${label} warmed up`);
    });

  ping().catch(() => {
    setTimeout(() => {
      ping().catch((err) => console.warn(`${label} warm-up failed:`, err));
    }, 10000);
  });
}

function App() {

  useEffect(() => {
    if (javaUrl) wakeBackend(javaUrl, "Java backend");
    if (pythonUrl) wakeBackend(pythonUrl, "Python backend");
  }, []);

  return (
    <div className="min-vh-100">
      <MainContainer/>
    </div>
  );
}

export default App;
