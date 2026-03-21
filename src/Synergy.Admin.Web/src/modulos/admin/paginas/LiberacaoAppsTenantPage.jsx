import { useState, useEffect } from "react";
import { obterTenants } from "../../../mocks/tenants";
import { obterEmpresas } from "../../../mocks/empresas";
import { obterAplicacoes } from "../../../mocks/aplicacoes";
import { obterAppsLiberadosPorTenant, salvarLiberacao } from "../../../mocks/tenantApps";

export function LiberacaoAppsTenantPage() {
  const [tenants, setTenants] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [aplicacoes, setAplicacoes] = useState([]);
  const [tenantSelecionado, setTenantSelecionado] = useState(null);
  const [liberados, setLiberados] = useState([]);

  useEffect(() => {
    obterTenants().then(setTenants);
    obterEmpresas().then(setEmpresas);
    obterAplicacoes().then(setAplicacoes);
  }, []);

  useEffect(() => {
    if (tenantSelecionado) {
      obterAppsLiberadosPorTenant(tenantSelecionado.id).then(setLiberados);
    } else {
      setLiberados([]);
    }
  }, [tenantSelecionado]);

  const nomeEmpresa = (empresaId) => empresas.find((e) => e.id === empresaId)?.nome ?? "—";

  const toggleLiberacao = async (appId, liberado) => {
    if (!tenantSelecionado) return;
    await salvarLiberacao(tenantSelecionado.id, appId, liberado);
    setLiberados((prev) =>
      liberado ? [...prev, appId] : prev.filter((id) => id !== appId)
    );
  };

  return (
    <>
      <h1 className="pagina-titulo">Liberação de Apps por Tenant</h1>
      <p className="pagina-subtitulo">
        Selecione um tenant e marque os apps que deseja liberar para ele.
      </p>
      <div className="form-grupo" style={{ maxWidth: "400px", marginBottom: "var(--space-3)" }}>
        <label className="form-label">Tenant</label>
        <select
          className="form-select"
          value={tenantSelecionado?.id ?? ""}
          onChange={(e) => {
            const t = tenants.find((x) => x.id === e.target.value);
            setTenantSelecionado(t ?? null);
          }}
        >
          <option value="">Selecione um tenant</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {nomeEmpresa(t.empresaId)} → {t.nome}
            </option>
          ))}
        </select>
      </div>
      {tenantSelecionado && (
        <div className="card">
          <h3 className="secao-titulo">
            Apps liberados para: {tenantSelecionado.nome}
          </h3>
          <p className="pagina-subtitulo" style={{ marginBottom: "var(--space-2)" }}>
            Empresa: {nomeEmpresa(tenantSelecionado.empresaId)}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {aplicacoes.map((app) => {
              const liberado = liberados.includes(app.id);
              return (
                <label
                  key={app.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    background: liberado ? "var(--primary-light)" : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={liberado}
                    onChange={(e) => toggleLiberacao(app.id, e.target.checked)}
                  />
                  <span>{app.nome}</span>
                  <span style={{ color: "var(--cor-texto-claro)", fontSize: "0.8125rem" }}>
                    ({app.tipo}) — {app.chave}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
