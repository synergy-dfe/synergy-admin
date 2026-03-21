import { useEffect, useState, useMemo, useRef } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useWorkspace } from "../../contextos/ContextoWorkspace";
import { useAutenticacao } from "../../contextos/ContextoAutenticacao";
import { useAplicacoes } from "../../contextos/ContextoAplicacoes";
import { useTema } from "../../contextos/ContextoTema";

/**
 * Host para aplicações externas.
 * Carrega o app via iframe usando a URL configurada no cadastro.
 * O app externo recebe:
 * - Querystring: embedded, empresaId, tenantId, theme, primaryColor, primaryHover, primaryLight
 * - postMessage (type: SYNERGY_PORTAL_THEME) quando o tema muda
 *
 * Para obedecer a paleta do portal, o app externo deve:
 * 1. Ler ?theme= e ?primaryColor= na URL ao carregar
 * 2. Ouvir window.addEventListener('message', e => e.data?.type === 'SYNERGY_PORTAL_THEME')
 * 3. Aplicar --color-primary, --color-primary-hover conforme a paleta recebida
 */
const PALETA_PORTAL = {
  primary: "#3b82f6",
  primaryHover: "#2563eb",
  primaryLight: "#dbeafe",
};

export function HostAplicacaoExterna() {
  const { appChave } = useParams();
  const { pathname } = useLocation();
  const { empresa, tenant, empresaId, empresaNome, tenantId, tenantNome } = useWorkspace();
  const { usuario } = useAutenticacao();
  const { tema } = useTema();
  const { verificarAppLiberado, getAppPorChave } = useAplicacoes();
  const [liberado, setLiberado] = useState(null);
  const iframeRef = useRef(null);

  const app = useMemo(() => getAppPorChave(appChave), [appChave, getAppPorChave]);

  useEffect(() => {
    if (!tenantId || !appChave) {
      setLiberado(false);
      return;
    }
    verificarAppLiberado(tenantId, appChave).then(setLiberado);
  }, [tenantId, appChave, verificarAppLiberado]);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    const msg = {
      type: "SYNERGY_PORTAL_THEME",
      theme: tema,
      palette: PALETA_PORTAL,
    };
    try {
      iframeRef.current.contentWindow.postMessage(msg, "*");
    } catch {
      // cross-origin: ignorar
    }
  }, [tema]);

  if (!app || app.tipo !== "externa" || !app.urlBase) {
    return (
      <div className="host-aplicacao-externa">
        <div className="host-placeholder">
          <h3>App não configurado</h3>
          <p>O app &quot;{appChave}&quot; não está cadastrado como aplicação externa ou não possui URL base.</p>
        </div>
      </div>
    );
  }

  const urlBaseOrigin = (() => {
    try {
      return new URL(app.urlBase).origin;
    } catch {
      return "";
    }
  })();
  const mesmaOrigem = typeof window !== "undefined" && urlBaseOrigin === window.location.origin;
  if (mesmaOrigem) {
    return (
      <div className="host-aplicacao-externa">
        <div className="host-placeholder">
          <h3>Configuração incorreta</h3>
          <p>
            A URL base do app &quot;{app.nome}&quot; ({app.urlBase}) aponta para o próprio portal.
            Configure a <strong>urlBase</strong> para o endereço do app externo (ex: http://localhost:5173 para Synergy.Nfe).
          </p>
        </div>
      </div>
    );
  }

  if (liberado === false) {
    return <Navigate to="/portal/admin" replace />;
  }
  if (liberado === null || !tenantId) {
    return (
      <div className="host-aplicacao-externa">
        <div className="host-placeholder">
          <p>Selecione um tenant para acessar este app.</p>
        </div>
      </div>
    );
  }

  // Monta a URL do app externo com contexto em querystring
  const baseRotaApp = `/portal/apps/${appChave}`;
  const pathRelativo = pathname.startsWith(baseRotaApp)
    ? pathname.slice(baseRotaApp.length) || "/"
    : "/";

  const params = new URLSearchParams({
    embedded: "true",
    empresaId: empresaId ?? "",
    empresaNome: empresaNome ?? "",
    tenantId: tenantId ?? "",
    tenantNome: tenantNome ?? "",
    usuarioNome: usuario?.nome ?? usuario?.login ?? "",
    theme: tema,
    primaryColor: PALETA_PORTAL.primary,
    primaryHover: PALETA_PORTAL.primaryHover,
    primaryLight: PALETA_PORTAL.primaryLight,
  });

  const urlIframe = `${app.urlBase.replace(/\/$/, "")}${pathRelativo}${pathRelativo.includes("?") ? "&" : "?"}${params.toString()}`;

  return (
    <div className="host-aplicacao-externa host-externo-iframe">
      <iframe
        ref={iframeRef}
        src={urlIframe}
        title={app.nome}
        className="host-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
