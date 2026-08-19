import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { ThemeContext } from "./ThemeContext";
import type { Theme } from "./ThemeContext.types";

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }     
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  localStorage.setItem("theme", systemTheme);
  return systemTheme;
}

export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    function toggleTheme() {
        const newTheme = theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    }

    useMemo(() => {
        return {
        theme,
        toggleTheme,
        };
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

