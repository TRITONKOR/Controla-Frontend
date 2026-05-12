import { createRoot } from "react-dom/client";
import "./api/interceptors";
import App from "./App.tsx";
import "./index.scss";

createRoot(document.getElementById("root")!).render(<App />);
