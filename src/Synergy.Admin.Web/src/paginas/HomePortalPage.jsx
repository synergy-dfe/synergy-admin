import { Navigate } from "react-router-dom";
import { useWorkspace } from "../contextos/ContextoWorkspace";

export function HomePortalPage() {
  const { tenant } = useWorkspace();

  if (!tenant) {
    return <Navigate to="/selecionar-empresa" replace />;
  }
  return <Navigate to="/portal/admin" replace />;
}
