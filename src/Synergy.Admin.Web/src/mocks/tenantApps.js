/**
 * Mock de liberação de apps por tenant.
 * tenantId -> [appIds liberados]
 * Em memória para permitir alterações durante o desenvolvimento.
 */
let tenantApps = {
  "1": ["1", "2"],
  "2": ["1"],
  "3": ["2"],
  "4": ["1", "2"],
};

export const obterAppsLiberadosPorTenant = (tenantId) =>
  Promise.resolve([...(tenantApps[tenantId] || [])]);

export const obterLiberacoes = () =>
  Promise.resolve(
    Object.entries(tenantApps).flatMap(([tenantId, appIds]) =>
      appIds.map((appId) => ({ tenantId, appId }))
    )
  );

export const salvarLiberacao = (tenantId, appId, liberado) => {
  const atual = tenantApps[tenantId] || [];
  if (liberado) {
    if (!atual.includes(appId)) tenantApps[tenantId] = [...atual, appId];
  } else {
    tenantApps[tenantId] = atual.filter((id) => id !== appId);
  }
  return Promise.resolve();
};
