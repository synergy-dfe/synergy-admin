import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAplicacoes } from "../../contextos/ContextoAplicacoes";

export function AppAtivoSync() {
  const { pathname } = useLocation();
  const { definirAppAtivo } = useAplicacoes();

  useEffect(() => {
    if (pathname.startsWith("/portal/admin")) {
      definirAppAtivo("admin");
    } else if (pathname.startsWith("/portal/apps/")) {
      const match = pathname.match(/^\/portal\/apps\/([^/]+)/);
      const appChave = match?.[1];
      definirAppAtivo(appChave ?? null);
    } else {
      definirAppAtivo(null);
    }
  }, [pathname, definirAppAtivo]);

  return null;
}
