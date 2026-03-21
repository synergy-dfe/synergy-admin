/**
 * Registro estático de apps internos (Admin).
 * Apps externos vêm do cadastro de aplicações (mocks/API).
 * Mantido para retrocompatibilidade com apps internos fixos.
 */
export const APPS_INTERNOS = [
  {
    id: "admin",
    chave: "admin",
    nome: "Admin",
    tipo: "interna",
    rotaBasePortal: "/portal/admin",
    descricao: "Módulo administrativo do portal Synergy",
  },
];

/** @deprecated Use aplicacoes do contexto (obterAplicacoes) - mantido para fallback */
export const REGISTRO_APLICACOES = APPS_INTERNOS;

export const getAppInternoPorChave = (chave) =>
  APPS_INTERNOS.find((app) => app.chave === chave);
