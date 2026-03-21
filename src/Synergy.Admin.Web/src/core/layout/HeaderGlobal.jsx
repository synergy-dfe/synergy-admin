import { useAutenticacao } from "../../contextos/ContextoAutenticacao";
import { useWorkspace } from "../../contextos/ContextoWorkspace";
import { TenantSwitcher } from "../../componentes/TenantSwitcher";
import { TemaToggle } from "../../componentes/TemaToggle";

export function HeaderGlobal() {
  const { usuario } = useAutenticacao();
  const { empresa, tenant } = useWorkspace();

  return (
    <header className="layout-header">
      <div className="header-global">
        <div className="header-left">
          <span className="header-logo">Synergy</span>
        </div>
        <div className="header-center">
          <div className="header-workspace-switchers">
            <TenantSwitcher empresa={empresa} tenant={tenant} />
          </div>
        </div>
        <div className="header-right">
          <TemaToggle />
          <span className="header-usuario-nome">
            {usuario?.nome ?? usuario?.login ?? "Usuário"}
          </span>
        </div>
      </div>
    </header>
  );
}
