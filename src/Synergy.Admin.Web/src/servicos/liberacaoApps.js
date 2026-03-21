import { obterAppsLiberadosPorTenant } from "../mocks/tenantApps";
import { obterAplicacoes } from "../mocks/aplicacoes";

/**
 * Verifica se um app (por chave, ex: "nfe", "admin") está liberado para o tenant.
 * Mapeia chave do registro para id da aplicação no mock.
 */
export async function isAppLiberadoParaTenant(tenantId, appChave) {
  if (!tenantId) return false;
  const [liberados, aplicacoes] = await Promise.all([
    obterAppsLiberadosPorTenant(tenantId),
    obterAplicacoes(),
  ]);
  const app = aplicacoes.find((a) => a.chave === appChave);
  if (!app) return false;
  return liberados.includes(app.id);
}
