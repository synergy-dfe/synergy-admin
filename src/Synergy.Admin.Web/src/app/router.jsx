import { createBrowserRouter, Navigate } from "react-router-dom";
import { LayoutPortal } from "../core/layout/LayoutPortal";
import { LoginPage } from "../paginas/LoginPage";
import { HomePortalPage } from "../paginas/HomePortalPage";
import { SelecionarEmpresaPage } from "../paginas/SelecionarEmpresaPage";
import { SelecionarTenantPage } from "../paginas/SelecionarTenantPage";
import { DashboardAdminPage } from "../modulos/admin/paginas/DashboardAdminPage";
import { EmpresasPage } from "../modulos/admin/paginas/EmpresasPage";
import { TenantsPage } from "../modulos/admin/paginas/TenantsPage";
import { AplicacoesPage } from "../modulos/admin/paginas/AplicacoesPage";
import { LiberacaoAppsTenantPage } from "../modulos/admin/paginas/LiberacaoAppsTenantPage";
import { HostAplicacaoExterna } from "../core/hosts/HostAplicacaoExterna";

function RotaProtegida({ children }) {
  const usuario = sessionStorage.getItem("synergy_usuario_fake");
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  { path: "/", element: <HomePortalPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/selecionar-empresa",
    element: (
      <RotaProtegida>
        <SelecionarEmpresaPage />
      </RotaProtegida>
    ),
  },
  {
    path: "/selecionar-tenant",
    element: (
      <RotaProtegida>
        <SelecionarTenantPage />
      </RotaProtegida>
    ),
  },
  {
    path: "/portal",
    element: (
      <RotaProtegida>
        <LayoutPortal />
      </RotaProtegida>
    ),
    children: [
      {
        path: "apps/:appChave/*",
        element: <HostAplicacaoExterna />,
      },
      { index: true, element: <Navigate to="/portal/admin" replace /> },
      { path: "admin", element: <DashboardAdminPage /> },
      { path: "admin/empresas", element: <EmpresasPage /> },
      { path: "admin/tenants", element: <TenantsPage /> },
      { path: "admin/aplicacoes", element: <AplicacoesPage /> },
      { path: "admin/liberacao-apps", element: <LiberacaoAppsTenantPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
