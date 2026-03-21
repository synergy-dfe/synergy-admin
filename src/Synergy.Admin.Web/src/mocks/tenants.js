/**
 * Mock de tenants para desenvolvimento.
 * Tenant = Unidade/ambiente pertencente a uma empresa.
 * Estado em memória para permitir CRUD durante o desenvolvimento.
 */
let tenants = [
  { id: "1", empresaId: "1", nome: "Matriz", tipo: "producao", status: "ativo" },
  { id: "2", empresaId: "1", nome: "Filial Goiânia", tipo: "producao", status: "ativo" },
  { id: "3", empresaId: "1", nome: "Homologação", tipo: "homologacao", status: "ativo" },
  { id: "4", empresaId: "2", nome: "Matriz Beta", tipo: "producao", status: "ativo" },
];

export const obterTenants = () => Promise.resolve([...tenants]);
export const obterTenantsPorEmpresa = (empresaId) =>
  Promise.resolve(tenants.filter((t) => t.empresaId === empresaId));
export const obterTenantPorId = (id) =>
  Promise.resolve(tenants.find((t) => t.id === id));

export const criarTenant = (novo) => {
  const maxId = Math.max(0, ...tenants.map((t) => parseInt(t.id, 10) || 0));
  novo.id = String(maxId + 1);
  tenants = [...tenants, novo];
  return Promise.resolve(novo);
};
