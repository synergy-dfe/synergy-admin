import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkspace } from "../../contextos/ContextoWorkspace";
import { useAplicacoes } from "../../contextos/ContextoAplicacoes";

export function TenantLiberacoesSync() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tenantId } = useWorkspace();
  const {
    aplicacoes,
    carregarLiberacoesPorTenant,
    carregarManifestsAppsExternos,
    verificarAppLiberado,
  } = useAplicacoes();

  useEffect(() => {
    if (!tenantId || !aplicacoes.length) return;
    (async () => {
      await carregarLiberacoesPorTenant(tenantId);
      await carregarManifestsAppsExternos(tenantId);
    })();
  }, [tenantId, aplicacoes, carregarLiberacoesPorTenant, carregarManifestsAppsExternos]);

  useEffect(() => {
    const match = pathname.match(/^\/portal\/apps\/([^/]+)/);
    if (!match || !tenantId) return;
    const appChave = match[1];
    verificarAppLiberado(tenantId, appChave).then((liberado) => {
      if (!liberado) navigate("/portal/admin", { replace: true });
    });
  }, [tenantId, pathname, verificarAppLiberado, navigate]);

  return null;
}
