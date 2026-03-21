import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../contextos/ContextoWorkspace";
import { obterTenantsPorEmpresa } from "../mocks/tenants";
import { TemaToggle } from "../componentes/TemaToggle";

export function SelecionarTenantPage() {
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();
  const { empresa, selecionarTenant } = useWorkspace();

  useEffect(() => {
    if (empresa?.id) {
      obterTenantsPorEmpresa(empresa.id).then(setTenants);
    } else {
      navigate("/selecionar-empresa", { replace: true });
    }
  }, [empresa?.id, navigate]);

  const handleSelecionar = (tenant) => {
    selecionarTenant(tenant);
    navigate("/portal/admin");
  };

  const tipoLabel = (tipo) =>
    tipo === "producao" ? "Produção" : "Homologação";

  const tipoBadgeClass = (tipo) =>
    tipo === "producao" ? "badge-success" : "badge-neutral";

  return (
    <div className="selecao-page">
      <div className="selecao-page-tema">
        <TemaToggle />
      </div>
      <div className="selecao-container">
        <h1 className="selecao-titulo">Selecione o tenant</h1>
        <p className="selecao-subtitulo">
          {empresa?.nome}
        </p>
        <div className="selecao-cards">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              type="button"
              className="selecao-card selecao-card-menor"
              onClick={() => handleSelecionar(tenant)}
            >
              <span className="selecao-card-nome">{tenant.nome}</span>
              <span className={`badge ${tipoBadgeClass(tenant.tipo)}`}>
                {tipoLabel(tenant.tipo)}
              </span>
              <span className="selecao-card-arrow">→</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost selecao-voltar"
          onClick={() => navigate("/selecionar-empresa")}
        >
          ← Trocar empresa
        </button>
      </div>
    </div>
  );
}
