/**
 * Mock de empresas para desenvolvimento.
 * Empresa = Grupo organizacional que possui tenants.
 * Estado em memória para permitir CRUD durante o desenvolvimento.
 */
let empresas = [
  { id: "1", nome: "Grupo XPTO", documento: "00.000.000/0001-00", status: "ativo" },
  { id: "2", nome: "Empresa Beta", documento: "11.111.111/0001-11", status: "ativo" },
];

export const obterEmpresas = () => Promise.resolve([...empresas]);
export const obterEmpresaPorId = (id) =>
  Promise.resolve(empresas.find((e) => e.id === id));

export const criarEmpresa = (nova) => {
  const maxId = Math.max(0, ...empresas.map((e) => parseInt(e.id, 10) || 0));
  nova.id = String(maxId + 1);
  empresas = [...empresas, nova];
  return Promise.resolve(nova);
};
