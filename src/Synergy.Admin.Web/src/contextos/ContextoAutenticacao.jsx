import { createContext, useContext, useState, useCallback } from "react";

const ContextoAutenticacao = createContext(null);

const USUARIO_FAKE = { id: "1", nome: "Administrador", login: "admin" };
const SENHA_FAKE = "admin";

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = sessionStorage.getItem("synergy_usuario_fake");
    return salvo ? JSON.parse(salvo) : null;
  });

  const login = useCallback((loginDigitado, senhaDigitada) => {
    if (loginDigitado === USUARIO_FAKE.login && senhaDigitada === SENHA_FAKE) {
      setUsuario(USUARIO_FAKE);
      sessionStorage.setItem("synergy_usuario_fake", JSON.stringify(USUARIO_FAKE));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    sessionStorage.removeItem("synergy_usuario_fake");
  }, []);

  const estaAutenticado = !!usuario;

  return (
    <ContextoAutenticacao.Provider value={{ usuario, login, logout, estaAutenticado }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

export function useAutenticacao() {
  const ctx = useContext(ContextoAutenticacao);
  if (!ctx) throw new Error("useAutenticacao deve ser usado dentro de ProvedorAutenticacao");
  return ctx;
}
