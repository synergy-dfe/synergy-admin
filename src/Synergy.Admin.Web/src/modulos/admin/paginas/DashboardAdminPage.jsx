import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obterEmpresas } from "../../../mocks/empresas";
import { obterTenants } from "../../../mocks/tenants";
import { obterAplicacoes } from "../../../mocks/aplicacoes";
import { useWorkspace } from "../../../contextos/ContextoWorkspace";
import { useAplicacoes } from "../../../contextos/ContextoAplicacoes";

export function DashboardAdminPage() {
  const [empresas, setEmpresas] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [aplicacoes, setAplicacoes] = useState([]);
  const { tenantId } = useWorkspace();
  const { getAppsLiberadosByChave, getAppPorChave } = useAplicacoes();

  useEffect(() => {
    obterEmpresas().then(setEmpresas);
    obterTenants().then(setTenants);
    obterAplicacoes().then(setAplicacoes);
  }, []);

  const chavesLiberadas = tenantId ? getAppsLiberadosByChave(tenantId) : [];
  const appsLiberados = chavesLiberadas
    .map((chave) => getAppPorChave(chave))
    .filter(Boolean);

  return (
    <>
      <h1 className="pagina-titulo">Dashboard</h1>
      <p className="pagina-subtitulo">
        Visão geral da plataforma Synergy
      </p>
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-titulo">Total de Empresas</div>
          <div className="card-valor">{empresas.length}</div>
        </div>
        <div className="card">
          <div className="card-titulo">Total de Tenants</div>
          <div className="card-valor">{tenants.length}</div>
        </div>
        <div className="card">
          <div className="card-titulo">Apps Cadastrados</div>
          <div className="card-valor">{aplicacoes.length}</div>
        </div>
      </div>
      {tenantId && appsLiberados.length > 0 && (
        <div className="card" style={{ marginTop: "var(--space-3)" }}>
          <div className="card-titulo">Aplicações liberadas para o tenant</div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            {appsLiberados.map((app) => (
              <Link
                key={app.id}
                to={app.rotaBasePortal}
                className="card"
                style={{ flex: "1 1 140px", minWidth: "140px" }}
              >
                <div className="card-titulo">{app.nome}</div>
                <div className="card-link-text">Acessar →</div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {(!tenantId || appsLiberados.length === 0) && tenantId && (
        <div className="card" style={{ marginTop: "var(--space-3)" }}>
          <p style={{ color: "var(--cor-texto-secundario)" }}>
            Nenhum app liberado para este tenant. Use Liberação de Apps para configurar.
          </p>
        </div>
      )}
      {!tenantId && (
        <div className="card" style={{ marginTop: "var(--space-3)" }}>
          <p style={{ color: "var(--cor-texto-secundario)" }}>
            Selecione uma empresa e um tenant no header para ver os apps liberados.
          </p>
        </div>
      )}
      <div className="card" style={{ marginTop: "var(--space-3)" }}>
        <div className="card-titulo">Hierarquia da Plataforma</div>
        <p style={{ fontSize: "14px", color: "var(--cor-texto-secundario)" }}>
          <strong>Empresa (Grupo)</strong> → <strong>Tenant</strong> → <strong>Apps liberados</strong>
        </p>
        <p style={{ marginTop: "var(--space-1)", fontSize: "14px", color: "var(--cor-texto-secundario)" }}>
          Cadastre empresas, vincule tenants às empresas e libere apps por tenant.
        </p>
      </div>
    </>
  );
}
