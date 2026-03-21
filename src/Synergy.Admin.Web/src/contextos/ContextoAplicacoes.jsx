import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { obterAplicacoes } from "../mocks/aplicacoes";
import { obterAppsLiberadosPorTenant } from "../mocks/tenantApps";
import { isAppLiberadoParaTenant } from "../servicos/liberacaoApps";
import { getAppInternoPorChave } from "../aplicacoes/registro-aplicacoes";
import { buscarManifestAplicacaoExterna } from "../aplicacoes/manifestUtils";

const ContextoAplicacoes = createContext(null);

export function ProvedorAplicacoes({ children }) {
  const [aplicacoes, setAplicacoes] = useState([]);
  const [appsLiberadosPorTenant, setAppsLiberadosPorTenant] = useState({});
  const [manifestsPorChave, setManifestsPorChave] = useState({});
  const [appAtivo, setAppAtivo] = useState(null);

  const carregarAplicacoes = useCallback(async () => {
    const apps = await obterAplicacoes();
    setAplicacoes(apps);
  }, []);

  const carregarLiberacoesPorTenant = useCallback(async (tenantId) => {
    if (!tenantId) return;
    const liberados = await obterAppsLiberadosPorTenant(tenantId);
    setAppsLiberadosPorTenant((prev) => ({ ...prev, [tenantId]: liberados }));
  }, []);

  const carregarManifestsAppsExternos = useCallback(
    async (tenantId) => {
      if (!tenantId || !aplicacoes.length) {
        setManifestsPorChave({});
        return;
      }
      const liberados = await obterAppsLiberadosPorTenant(tenantId);
      const idsLiberados = new Set(liberados);
      const appsExternos = aplicacoes.filter(
        (a) =>
          a.tipo === "externa" &&
          a.status === "ativo" &&
          idsLiberados.has(a.id) &&
          a.urlBase
      );
      const novos = {};
      await Promise.all(
        appsExternos.map(async (app) => {
          const manifest = await buscarManifestAplicacaoExterna(app);
          if (manifest) novos[app.chave] = manifest;
        })
      );
      setManifestsPorChave(novos);
    },
    [aplicacoes]
  );

  const getManifestPorChave = useCallback(
    (chave) => manifestsPorChave[chave] ?? null,
    [manifestsPorChave]
  );

  const obterLiberados = useCallback(
    (tenantId) => appsLiberadosPorTenant[tenantId] ?? [],
    [appsLiberadosPorTenant]
  );

  const appsLiberadosParaTenant = useCallback(
    (tenantId) => {
      const ids = appsLiberadosPorTenant[tenantId] ?? [];
      return aplicacoes
        .filter((a) => ids.includes(a.id))
        .map((a) => ({ ...a, chave: a.chave }));
    },
    [aplicacoes, appsLiberadosPorTenant]
  );

  const getAppsLiberadosByChave = useCallback(
    (tenantId) => {
      const ids = appsLiberadosPorTenant[tenantId] ?? [];
      return aplicacoes
        .filter((a) => ids.includes(a.id))
        .map((a) => a.chave);
    },
    [aplicacoes, appsLiberadosPorTenant]
  );

  const verificarAppLiberado = useCallback(async (tenantId, appChave) => {
    return isAppLiberadoParaTenant(tenantId, appChave);
  }, []);

  const getAppPorChave = useCallback(
    (chave) => {
      const app = aplicacoes.find((a) => a.chave === chave);
      if (app) return app;
      return getAppInternoPorChave(chave) ?? null;
    },
    [aplicacoes]
  );

  const definirAppAtivo = useCallback(
    (appChave) => {
      setAppAtivo(appChave ? getAppPorChave(appChave) ?? null : null);
    },
    [getAppPorChave]
  );

  useEffect(() => {
    carregarAplicacoes();
  }, [carregarAplicacoes]);

  return (
    <ContextoAplicacoes.Provider
      value={{
        aplicacoes,
        appsLiberadosPorTenant,
        manifestsPorChave,
        appAtivo,
        carregarAplicacoes,
        carregarLiberacoesPorTenant,
        carregarManifestsAppsExternos,
        getManifestPorChave,
        obterLiberados,
        appsLiberadosParaTenant,
        getAppsLiberadosByChave,
        getAppPorChave,
        verificarAppLiberado,
        definirAppAtivo,
      }}
    >
      {children}
    </ContextoAplicacoes.Provider>
  );
}

export function useAplicacoes() {
  const ctx = useContext(ContextoAplicacoes);
  if (!ctx) throw new Error("useAplicacoes deve ser usado dentro de ProvedorAplicacoes");
  return ctx;
}
