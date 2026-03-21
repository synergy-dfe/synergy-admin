import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkspace } from "../contextos/ContextoWorkspace";
import { useAplicacoes } from "../contextos/ContextoAplicacoes";
import { obterTenantsPorEmpresa } from "../mocks/tenants";
import { obterEmpresas } from "../mocks/empresas";

export function TenantSwitcher({ empresa, tenant }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selecionarEmpresa, selecionarTenant } = useWorkspace();
  const { verificarAppLiberado } = useAplicacoes();
  const [empresas, setEmpresas] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    obterEmpresas().then(setEmpresas);
  }, []);

  useEffect(() => {
    if (empresa?.id) {
      obterTenantsPorEmpresa(empresa.id).then(setTenants);
    } else {
      setTenants([]);
    }
  }, [empresa?.id]);

  const handleEmpresa = (e) => {
    const id = e.target.value;
    const emp = empresas.find((x) => x.id === id);
    selecionarEmpresa(emp ?? null);
  };

  const handleTenant = async (e) => {
    const id = e.target.value;
    const t = tenants.find((x) => x.id === id);
    selecionarTenant(t ?? null);

    if (!t) return;

    const matchAppExterno = pathname.match(/^\/portal\/apps\/([^/]+)/);
    if (matchAppExterno) {
      const appChave = matchAppExterno[1];
      const liberado = await verificarAppLiberado(t.id, appChave);
      if (!liberado) navigate("/portal/admin", { replace: true });
    }
  };

  return (
    <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" }}>
      <select
        className="switcher"
        value={empresa?.id ?? ""}
        onChange={handleEmpresa}
        title="Selecionar empresa"
      >
        <option value="">Empresa</option>
        {empresas.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nome}
          </option>
        ))}
      </select>
      <select
        className="switcher"
        value={tenant?.id ?? ""}
        onChange={handleTenant}
        title="Selecionar tenant"
        disabled={!empresa}
      >
        <option value="">Tenant</option>
        {tenants.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
