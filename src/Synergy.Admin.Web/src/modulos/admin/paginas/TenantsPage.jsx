import { useState, useEffect } from "react";
import { obterTenants, criarTenant } from "../../../mocks/tenants";
import { obterEmpresas } from "../../../mocks/empresas";
import { TabelaBase } from "../../../componentes/TabelaBase";

export function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ empresaId: "", nome: "", tipo: "producao", status: "ativo" });

  useEffect(() => {
    obterTenants().then(setTenants);
    obterEmpresas().then(setEmpresas);
  }, []);

  const nomeEmpresa = (empresaId) => empresas.find((e) => e.id === empresaId)?.nome ?? "—";

  const colunas = [
    { chave: "nome", label: "Nome do Tenant" },
    { chave: "empresaId", label: "Empresa", render: (v) => nomeEmpresa(v) },
    { chave: "tipo", label: "Tipo" },
    {
      chave: "status",
      label: "Status",
      render: (val) => (
        <span className={`badge ${val === "ativo" ? "badge-success" : "badge-neutral"}`}>
          {val ? String(val).charAt(0).toUpperCase() + String(val).slice(1) : val}
        </span>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await criarTenant({ ...form });
    obterTenants().then(setTenants);
    setForm({ empresaId: "", nome: "", tipo: "producao", status: "ativo" });
    setMostrarForm(false);
  };

  return (
    <>
      <h1 className="pagina-titulo">Tenants</h1>
      <p className="pagina-subtitulo">
        Tenants pertencem a uma empresa. Cada tenant pode ter apps liberados diferentes.
      </p>
      <div className="pagina-acoes">
        <button
          type="button"
          className="btn btn-primario"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "Novo Tenant"}
        </button>
      </div>
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="secao-titulo">Cadastrar Tenant</h3>
          <div className="form-grupo">
            <label className="form-label">Empresa</label>
            <select
              className="form-select"
              value={form.empresaId}
              onChange={(e) => setForm({ ...form, empresaId: e.target.value })}
              required
            >
              <option value="">Selecione a empresa</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-grupo">
            <label className="form-label">Nome do Tenant</label>
            <input
              type="text"
              className="form-input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="Ex: Matriz, Filial Goiânia, Homologação"
            />
          </div>
          <div className="form-grupo">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="producao">Produção</option>
              <option value="homologacao">Homologação</option>
            </select>
          </div>
          <div className="form-grupo">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primario">
            Salvar
          </button>
        </form>
      )}
      <TabelaBase colunas={colunas} dados={tenants} />
    </>
  );
}
