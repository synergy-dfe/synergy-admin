import { createContext, useContext, useState, useCallback } from "react";

const ContextoWorkspace = createContext(null);

export function ProvedorWorkspace({ children }) {
  const [empresa, setEmpresa] = useState(null);
  const [tenant, setTenant] = useState(null);

  const selecionarEmpresa = useCallback((emp) => {
    setEmpresa(emp);
    setTenant(null);
  }, []);

  const selecionarTenant = useCallback((t) => {
    setTenant(t);
  }, []);

  const limparWorkspace = useCallback(() => {
    setEmpresa(null);
    setTenant(null);
  }, []);

  return (
    <ContextoWorkspace.Provider
      value={{
        empresa,
        tenant,
        empresaNome: empresa?.nome ?? null,
        tenantNome: tenant?.nome ?? null,
        empresaId: empresa?.id ?? null,
        tenantId: tenant?.id ?? null,
        selecionarEmpresa,
        selecionarTenant,
        limparWorkspace,
      }}
    >
      {children}
    </ContextoWorkspace.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(ContextoWorkspace);
  if (!ctx) throw new Error("useWorkspace deve ser usado dentro de ProvedorWorkspace");
  return ctx;
}
