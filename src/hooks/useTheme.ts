import { useState } from "react";
import {
  applyTheme,
  getInitialTheme,
  saveTheme,
  type Theme,
} from "../utils/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";

    applyTheme(next);
    saveTheme(next);
    setTheme(next);
  }

  return { theme, toggleTheme };
}
