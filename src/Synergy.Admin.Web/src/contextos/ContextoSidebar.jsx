import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "synergy_sidebar_collapsed";

const ContextoSidebar = createContext(null);

export function ProvedorSidebar({ children }) {
  const [colapsado, setColapsadoState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(colapsado));
  }, [colapsado]);

  const alternarSidebar = () => {
    setColapsadoState((prev) => !prev);
  };

  return (
    <ContextoSidebar.Provider value={{ colapsado, alternarSidebar }}>
      {children}
    </ContextoSidebar.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(ContextoSidebar);
  if (!ctx) throw new Error("useSidebar deve ser usado dentro de ProvedorSidebar");
  return ctx;
}
