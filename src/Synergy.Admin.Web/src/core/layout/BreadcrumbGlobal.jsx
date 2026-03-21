import { useLocation, Link } from "react-router-dom";
import { useWorkspace } from "../../contextos/ContextoWorkspace";
import { useAplicacoes } from "../../contextos/ContextoAplicacoes";
import { encontrarItemAtivoNoManifest } from "../../aplicacoes/manifestUtils";

const PAGINAS_ADMIN = {
  "/portal/admin": "Dashboard",
  "/portal/admin/empresas": "Empresas",
  "/portal/admin/tenants": "Tenants",
  "/portal/admin/aplicacoes": "Aplicações",
  "/portal/admin/liberacao-apps": "Liberação de Apps",
};

export function BreadcrumbGlobal() {
  const { pathname } = useLocation();
  const { empresaNome, tenantNome } = useWorkspace();
  const { appAtivo, getManifestPorChave } = useAplicacoes();

  const paginaAdmin = PAGINAS_ADMIN[pathname];
  const linkAdmin = "/portal/admin";
  const linkApp = appAtivo?.rotaBasePortal ?? linkAdmin;
  const appNome = appAtivo?.nome ?? "Admin";

  const matchAppExterno = pathname.match(/^\/portal\/apps\/([^/]+)/);
  const manifest = matchAppExterno ? getManifestPorChave(matchAppExterno[1]) : null;
  const rotaBaseApp = matchAppExterno ? `/portal/apps/${matchAppExterno[1]}` : null;
  const itemAtivo = manifest && rotaBaseApp
    ? encontrarItemAtivoNoManifest(manifest, pathname, rotaBaseApp)
    : null;

  const caminhoBreadcrumb = itemAtivo?.caminho ?? [];

  return (
    <nav className="layout-breadcrumb">
      <Link to="/portal/admin">Portal</Link>
      {empresaNome && (
        <>
          <span className="breadcrumb-sep">›</span>
          <span>{empresaNome}</span>
        </>
      )}
      {tenantNome && (
        <>
          <span className="breadcrumb-sep">›</span>
          <span>{tenantNome}</span>
        </>
      )}
      <span className="breadcrumb-sep">›</span>
      <Link to={linkApp}>
        <strong>{appNome}</strong>
      </Link>
      {paginaAdmin && paginaAdmin !== "Dashboard" && (
        <>
          <span className="breadcrumb-sep">›</span>
          <strong>{paginaAdmin}</strong>
        </>
      )}
      {caminhoBreadcrumb.map((label, i) => (
        <span key={i}>
          <span className="breadcrumb-sep">›</span>
          <strong>{label}</strong>
        </span>
      ))}
    </nav>
  );
}
