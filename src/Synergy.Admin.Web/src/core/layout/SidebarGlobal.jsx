import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  KeyRound,
  FileText,
  FolderOpen,
  Receipt,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useWorkspace } from "../../contextos/ContextoWorkspace";
import { useAutenticacao } from "../../contextos/ContextoAutenticacao";
import { useSidebar } from "../../contextos/ContextoSidebar";
import { useAplicacoes } from "../../contextos/ContextoAplicacoes";
import { resolverRotaPortalDoItem } from "../../aplicacoes/manifestUtils";

const ITENS_ADMIN = [
  { to: "/portal/admin", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/portal/admin/empresas", label: "Empresas", Icon: Building2 },
  { to: "/portal/admin/tenants", label: "Tenants", Icon: Users },
  { to: "/portal/admin/aplicacoes", label: "Aplicações", Icon: Package },
  { to: "/portal/admin/liberacao-apps", label: "Liberação de Apps", Icon: KeyRound },
];

function getIconForManifestItem(item) {
  const path = (item.path || "").toLowerCase();
  const label = (item.label || "").toLowerCase();
  if (path.includes("painel") || label.includes("painel")) return LayoutDashboard;
  if (path.includes("fornecedor") || label.includes("fornecedor")) return Users;
  if (path.includes("cliente") || label.includes("cliente")) return Users;
  if (path.includes("item") || label.includes("item")) return FileText;
  if (path.includes("nfe") || label.includes("emitida")) return Receipt;
  if (item.children?.length) return FolderOpen;
  return FileText;
}

function SidebarItemManifest({ app, item, pathname, rotaBasePortal, colapsado }) {
  if (item.children?.length) {
    return (
      <SidebarGrupoManifest
        app={app}
        item={item}
        pathname={pathname}
        rotaBasePortal={rotaBasePortal}
        colapsado={colapsado}
      />
    );
  }
  const to = resolverRotaPortalDoItem(app, item.path);
  if (!to) return null;
  const isActive = pathname === to || (to !== rotaBasePortal && pathname.startsWith(to + "/"));
  const Icon = getIconForManifestItem(item);
  return (
    <li className="sidebar-item">
      <NavLink
        to={to}
        className={({ isActive: navActive }) =>
          `sidebar-link ${navActive || isActive ? "active" : ""}`
        }
        title={item.label}
      >
        <span className="sidebar-icon">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        {!colapsado && <span>{item.label}</span>}
      </NavLink>
    </li>
  );
}

function SidebarGrupoManifest({ app, item, pathname, rotaBasePortal, colapsado }) {
  const filhosTemAtivo = (items) => {
    for (const i of items || []) {
      if (i.path) {
        const to = resolverRotaPortalDoItem(app, i.path);
        if (to && (pathname === to || pathname.startsWith(to + "/"))) return true;
      }
      if (i.children?.length && filhosTemAtivo(i.children)) return true;
    }
    return false;
  };
  const temAtivo = filhosTemAtivo(item.children);

  if (colapsado) {
    const primeiroFilho = item.children?.[0];
    const to = primeiroFilho?.path
      ? resolverRotaPortalDoItem(app, primeiroFilho.path)
      : app?.rotaBasePortal;
    if (!to) return null;
    return (
      <li className="sidebar-item">
        <NavLink
          to={to}
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          title={item.label}
        >
          <span className="sidebar-icon">
            <FolderOpen size={20} strokeWidth={1.75} />
          </span>
        </NavLink>
      </li>
    );
  }

  return (
    <li className="sidebar-item sidebar-grupo-manifest">
      <details className="sidebar-details" open={temAtivo}>
        <summary className="sidebar-summary">
          <FolderOpen size={18} strokeWidth={1.75} />
          {item.label}
        </summary>
        <ul className="sidebar-submenu">
          {item.children.map((child, idx) => (
            <SidebarItemManifest
              key={child.path || child.label || idx}
              app={app}
              item={child}
              pathname={pathname}
              rotaBasePortal={rotaBasePortal}
              colapsado={colapsado}
            />
          ))}
        </ul>
      </details>
    </li>
  );
}

function SidebarAppExterno({ app, manifest, pathname, colapsado, expanded, onToggle }) {
  const rotaBase = app.rotaBasePortal || "";
  const isActive = pathname.startsWith(rotaBase);
  const Icon = Receipt;

  if (!manifest?.items?.length) {
    return (
      <li className="sidebar-item">
        <NavLink
          to={app.rotaBasePortal}
          className={({ isActive: navActive }) => `sidebar-link ${navActive ? "active" : ""}`}
          title={app.nome}
        >
          <span className="sidebar-icon">
            <Icon size={20} strokeWidth={1.75} />
          </span>
          {!colapsado && <span>{app.nome}</span>}
        </NavLink>
      </li>
    );
  }

  if (colapsado) {
    const primeiroItem = manifest.items[0];
    const child = primeiroItem?.path
      ? manifest.items.find((i) => i.path) || primeiroItem
      : null;
    const to = child
      ? resolverRotaPortalDoItem(app, child.path)
      : resolverRotaPortalDoItem(app, manifest.items[0]?.path);
    if (!to) return null;
    return (
      <li className="sidebar-item">
        <NavLink
          to={to}
          className={({ isActive: navActive }) => `sidebar-link ${navActive ? "active" : ""}`}
          title={app.nome}
        >
          <span className="sidebar-icon">
            <Icon size={20} strokeWidth={1.75} />
          </span>
        </NavLink>
      </li>
    );
  }

  return (
    <li className="sidebar-item sidebar-app-externo">
      <button
        type="button"
        className={`sidebar-app-trigger ${expanded ? "expanded" : ""} ${isActive ? "active" : ""}`}
        onClick={onToggle}
      >
        <span className="sidebar-icon">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <span>{app.nome}</span>
        <span className="sidebar-app-chevron">
          {expanded ? (
            <ChevronDown size={18} strokeWidth={2} />
          ) : (
            <ChevronRight size={18} strokeWidth={2} />
          )}
        </span>
      </button>
      {expanded && (
        <ul className="sidebar-submenu">
          {manifest.items.map((item, idx) => (
            <SidebarItemManifest
              key={item.path || item.label || idx}
              app={app}
              item={item}
              pathname={pathname}
              rotaBasePortal={app.rotaBasePortal}
              colapsado={colapsado}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SidebarGlobal() {
  const { pathname } = useLocation();
  const { tenantId } = useWorkspace();
  const { usuario, logout } = useAutenticacao();
  const { colapsado, alternarSidebar } = useSidebar();
  const { aplicacoes, getAppsLiberadosByChave, getManifestPorChave } = useAplicacoes();

  const chavesLiberadas = tenantId ? getAppsLiberadosByChave(tenantId) : [];
  const appsExternosLiberados = aplicacoes.filter(
    (a) => a.tipo === "externa" && a.status === "ativo" && chavesLiberadas.includes(a.chave)
  );

  const isAdminActive = pathname.startsWith("/portal/admin") && !pathname.startsWith("/portal/apps/");

  const [expandedSections, setExpandedSections] = useState(() => new Set());

  useEffect(() => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (isAdminActive) next.add("admin");
      appsExternosLiberados.forEach((app) => {
        if (pathname.startsWith(app.rotaBasePortal || "")) next.add(app.chave);
      });
      return next;
    });
  }, [pathname]);

  const toggleSection = (key) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const adminExpanded = expandedSections.has("admin");

  return (
    <nav className={`sidebar-global ${colapsado ? "sidebar-global--collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">S</span>
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={alternarSidebar}
          title={colapsado ? "Expandir menu" : "Recolher menu"}
          aria-label={colapsado ? "Expandir menu" : "Recolher menu"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item sidebar-section">
            {colapsado ? (
              <NavLink
                to="/portal/admin"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                title="Admin"
              >
                <span className="sidebar-icon">
                  <LayoutDashboard size={20} strokeWidth={1.75} />
                </span>
              </NavLink>
            ) : (
              <>
                <button
                  type="button"
                  className={`sidebar-section-trigger ${adminExpanded ? "expanded" : ""} ${isAdminActive ? "active" : ""}`}
                  onClick={() => toggleSection("admin")}
                >
                  <span className="sidebar-icon">
                    <LayoutDashboard size={20} strokeWidth={1.75} />
                  </span>
                  <span>Admin</span>
                  <span className="sidebar-section-chevron">
                    {adminExpanded ? (
                      <ChevronDown size={18} strokeWidth={2} />
                    ) : (
                      <ChevronRight size={18} strokeWidth={2} />
                    )}
                  </span>
                </button>
                {adminExpanded && (
              <ul className="sidebar-submenu">
                {ITENS_ADMIN.map((item) => (
                  <li key={item.to} className="sidebar-item">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                      end={item.to === "/portal/admin"}
                      title={item.label}
                    >
                      <span className="sidebar-icon">
                        <item.Icon size={20} strokeWidth={1.75} />
                      </span>
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
              </>
            )}
          </li>
          {appsExternosLiberados.map((app) => {
            const manifest = getManifestPorChave(app.chave);
            return (
              <SidebarAppExterno
                key={app.id}
                app={app}
                manifest={manifest}
                pathname={pathname}
                colapsado={colapsado}
                expanded={expandedSections.has(app.chave)}
                onToggle={() => toggleSection(app.chave)}
              />
            );
          })}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-divider" />
        <Link to="/portal/admin" className="sidebar-footer-link" title="Configurações">
          <span className="sidebar-icon">
            <Settings size={20} strokeWidth={1.75} />
          </span>
          {!colapsado && <span>Configurações</span>}
        </Link>
        <button
          type="button"
          className="sidebar-footer-link sidebar-footer-logout"
          onClick={logout}
          title="Sair"
        >
          <span className="sidebar-icon">
            <LogOut size={20} strokeWidth={1.75} />
          </span>
          {!colapsado && <span>Sair</span>}
        </button>
        <div className="sidebar-profile">
          <div className="sidebar-profile-avatar">
            <span>{(usuario?.nome?.[0] ?? usuario?.login?.[0] ?? "?")}</span>
            <span className="sidebar-profile-online" />
          </div>
          {!colapsado && (
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-nome">
                {usuario?.nome ?? usuario?.login ?? "Usuário"}
              </span>
              <span className="sidebar-profile-email">
                {usuario?.login ? `${usuario.login}@synergy` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
