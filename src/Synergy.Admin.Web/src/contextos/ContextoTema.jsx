import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "synergy_theme";

const ContextoTema = createContext(null);

export function ProvedorTema({ children }) {
  const [tema, setTemaState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(STORAGE_KEY, tema);
  }, [tema]);

  const alternarTema = () => {
    setTemaState((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema, isDark: tema === "dark" }}>
      {children}
    </ContextoTema.Provider>
  );
}

export function useTema() {
  const ctx = useContext(ContextoTema);
  if (!ctx) throw new Error("useTema deve ser usado dentro de ProvedorTema");
  return ctx;
}
