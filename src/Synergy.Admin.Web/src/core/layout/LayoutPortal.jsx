import { Outlet, Navigate } from "react-router-dom";
import { useWorkspace } from "../../contextos/ContextoWorkspace";
import { useSidebar } from "../../contextos/ContextoSidebar";
import { SidebarGlobal } from "./SidebarGlobal";
import { HeaderGlobal } from "./HeaderGlobal";
import { BreadcrumbGlobal } from "./BreadcrumbGlobal";
import { AppAtivoSync } from "./AppAtivoSync";
import { TenantLiberacoesSync } from "./TenantLiberacoesSync";

export function LayoutPortal() {
  const { tenant } = useWorkspace();
  const { colapsado } = useSidebar();

  if (!tenant) {
    return <Navigate to="/selecionar-empresa" replace />;
  }

  return (
    <>
      <AppAtivoSync />
      <TenantLiberacoesSync />
    <div className="layout-portal">
      <aside className={`layout-sidebar ${colapsado ? "layout-sidebar--collapsed" : ""}`}>
        <SidebarGlobal />
      </aside>
      <main className="layout-main">
        <HeaderGlobal />
        <BreadcrumbGlobal />
        <div className="layout-conteudo">
          <Outlet />
        </div>
      </main>
    </div>
    </>
  );
}
