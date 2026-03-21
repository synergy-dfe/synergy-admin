import { useState, useEffect } from "react";
import { obterAplicacoes, criarAplicacao } from "../../../mocks/aplicacoes";
import { TabelaBase } from "../../../componentes/TabelaBase";

export function AplicacoesPage() {
  const [aplicacoes, setAplicacoes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    chave: "",
    tipo: "interna",
    rotaBasePortal: "",
    urlBase: "",
    status: "ativo",
  });

  useEffect(() => {
    obterAplicacoes().then(setAplicacoes);
  }, []);

  const colunas = [
    { chave: "nome", label: "Nome" },
    { chave: "chave", label: "Chave" },
    { chave: "tipo", label: "Tipo" },
    { chave: "rotaBasePortal", label: "Rota no Portal" },
    { chave: "urlBase", label: "URL Base (externa)" },
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
    const payload = {
      ...form,
      urlBase: form.tipo === "externa" ? form.urlBase : null,
    };
    await criarAplicacao(payload);
    obterAplicacoes().then(setAplicacoes);
    setForm({ nome: "", chave: "", tipo: "interna", rotaBasePortal: "", urlBase: "", status: "ativo" });
    setMostrarForm(false);
  };

  return (
    <>
      <h1 className="pagina-titulo">Aplicações</h1>
      <p className="pagina-subtitulo">
        Apps da plataforma. Interna = páginas do portal. Externa = app hospedado em URL própria, exibido via iframe.
      </p>
      <div className="pagina-acoes">
        <button
          type="button"
          className="btn btn-primario"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "Nova Aplicação"}
        </button>
      </div>
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="secao-titulo">Cadastrar Aplicação</h3>
          <div className="form-grupo">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="Ex: Admin, Synergy.Nfe"
            />
          </div>
          <div className="form-grupo">
            <label className="form-label">Chave</label>
            <input
              type="text"
              className="form-input"
              value={form.chave}
              onChange={(e) => setForm({ ...form, chave: e.target.value })}
              required
              placeholder="Ex: admin, nfe"
            />
          </div>
          <div className="form-grupo">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="interna">Interna</option>
              <option value="externa">Externa</option>
            </select>
          </div>
          <div className="form-grupo">
            <label className="form-label">Rota no Portal</label>
            <input
              type="text"
              className="form-input"
              value={form.rotaBasePortal}
              onChange={(e) => setForm({ ...form, rotaBasePortal: e.target.value })}
              placeholder="Ex: /portal/admin, /portal/apps/nfe"
              required
            />
          </div>
          {form.tipo === "externa" && (
            <div className="form-grupo">
              <label className="form-label">URL Base</label>
              <input
                type="url"
                className="form-input"
                value={form.urlBase}
                onChange={(e) => setForm({ ...form, urlBase: e.target.value })}
                placeholder="Ex: http://localhost:5173"
                required={form.tipo === "externa"}
              />
              <small style={{ color: "var(--cor-texto-claro)", fontSize: "0.75rem" }}>
                URL onde o app externo está hospedado. Será carregado via iframe.
              </small>
            </div>
          )}
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
      <TabelaBase colunas={colunas} dados={aplicacoes} />
    </>
  );
}
