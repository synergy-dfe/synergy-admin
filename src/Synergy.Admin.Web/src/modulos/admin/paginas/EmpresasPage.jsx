import { useState, useEffect } from "react";
import { obterEmpresas, criarEmpresa } from "../../../mocks/empresas";
import { TabelaBase } from "../../../componentes/TabelaBase";

export function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nome: "", documento: "", status: "ativo" });

  useEffect(() => {
    obterEmpresas().then(setEmpresas);
  }, []);

  const colunas = [
    { chave: "nome", label: "Nome" },
    { chave: "documento", label: "Documento" },
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
    await criarEmpresa({ ...form });
    obterEmpresas().then(setEmpresas);
    setForm({ nome: "", documento: "", status: "ativo" });
    setMostrarForm(false);
  };

  return (
    <>
      <h1 className="pagina-titulo">Empresas</h1>
      <p className="pagina-subtitulo">
        Empresas (grupos) que possuem tenants. Hierarquia: Empresa → Tenants → Apps.
      </p>
      <div className="pagina-acoes">
        <button
          type="button"
          className="btn btn-primario"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "Nova Empresa"}
        </button>
      </div>
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="secao-titulo">Cadastrar Empresa</h3>
          <div className="form-grupo">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="Ex: Grupo XPTO"
            />
          </div>
          <div className="form-grupo">
            <label className="form-label">Documento (CNPJ)</label>
            <input
              type="text"
              className="form-input"
              value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value })}
              placeholder="00.000.000/0001-00"
            />
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
      <TabelaBase colunas={colunas} dados={empresas} />
    </>
  );
}
