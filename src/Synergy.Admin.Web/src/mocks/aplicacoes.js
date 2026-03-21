/**
 * Mock de aplicações cadastradas na plataforma.
 * Diferencia app interno (páginas do portal) de app externo (URL, carregado via iframe).
 * Estado em memória para permitir CRUD durante o desenvolvimento.
 *
 * Campos:
 * - id, nome, chave, tipo (interna|externa)
 * - rotaBasePortal: rota no portal onde o app é exibido
 * - urlBase: (apenas externa) URL base do app hospedado externamente
 * - status
 */
let aplicacoes = [
  {
    id: "1",
    nome: "Admin",
    chave: "admin",
    tipo: "interna",
    rotaBasePortal: "/portal/admin",
    urlBase: null,
    status: "ativo",
  },
  {
    id: "2",
    nome: "Synergy.Nfe",
    chave: "nfe",
    tipo: "externa",
    rotaBasePortal: "/portal/apps/nfe",
    urlBase: "http://localhost:5173",
    status: "ativo",
  },
];

export const obterAplicacoes = () => Promise.resolve([...aplicacoes]);
export const obterAplicacaoPorId = (id) =>
  Promise.resolve(aplicacoes.find((a) => a.id === id));

export const criarAplicacao = (nova) => {
  const maxId = Math.max(0, ...aplicacoes.map((a) => parseInt(a.id, 10) || 0));
  nova.id = String(maxId + 1);
  aplicacoes = [...aplicacoes, nova];
  return Promise.resolve(nova);
};
