/**
 * Utilitários para manifest de apps externos.
 * O manifest é o contrato remoto que define a árvore de menus do app.
 */

/**
 * Retorna a URL do manifest.json do app externo.
 * Em desenvolvimento, usa proxy do Vite para evitar CORS quando o app externo roda em localhost.
 * @param {Object} app - App com urlBase
 * @returns {string}
 */
export function obterUrlManifest(app) {
  if (!app?.urlBase) return null;
  const base = app.urlBase.replace(/\/$/, "");
  if (import.meta.env.DEV && base === "http://localhost:5173") {
    return "/proxy-manifest-nfe";
  }
  return `${base}/manifest.json`;
}

/**
 * Busca o manifest do app externo via fetch.
 * @param {Object} app - App com urlBase
 * @returns {Promise<Object|null>} Manifest ou null em caso de erro
 */
export async function buscarManifestAplicacaoExterna(app) {
  const url = obterUrlManifest(app);
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Resolve a rota do portal para um item do manifest.
 * @param {Object} app - App com rotaBasePortal
 * @param {string} itemPath - path do item (ex: "cadastro-item", "painel")
 * @returns {string}
 */
export function resolverRotaPortalDoItem(app, itemPath) {
  if (!app?.rotaBasePortal) return null;
  const base = app.rotaBasePortal.replace(/\/$/, "");
  const path = (itemPath || "").replace(/^\//, "");
  return path ? `${base}/${path}` : base;
}

/**
 * Encontra o item ativo no manifest com base na pathname.
 * Percorre a árvore recursivamente.
 * @param {Object} manifest - { app, items }
 * @param {string} pathname - ex: /portal/apps/nfe/cadastro-item
 * @param {string} rotaBasePortal - ex: /portal/apps/nfe
 * @returns {Object|null} { item, caminho } ou null. caminho = array de labels do breadcrumb
 */
export function encontrarItemAtivoNoManifest(manifest, pathname, rotaBasePortal) {
  if (!manifest?.items || !rotaBasePortal || !pathname.startsWith(rotaBasePortal)) {
    return null;
  }
  const sufixo = pathname.slice(rotaBasePortal.length).replace(/^\//, "") || "";
  const sufixoNorm = sufixo.toLowerCase();

  function buscar(items, caminho = []) {
    for (const item of items || []) {
      if (item.path) {
        const pathNorm = (item.path || "").toLowerCase();
        if (pathNorm === sufixoNorm || sufixoNorm.startsWith(pathNorm + "/")) {
          return { item, caminho: [...caminho, item.label] };
        }
      }
      if (item.children?.length) {
        const res = buscar(item.children, [...caminho, item.label]);
        if (res) return res;
      }
    }
    return null;
  }

  return buscar(manifest.items);
}
