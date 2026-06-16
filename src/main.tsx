import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyTheme, getStoredThemeIndex, themes } from "./lib/themes";

applyTheme(themes[getStoredThemeIndex()]);

createRoot(document.getElementById("root")!).render(<App />);
