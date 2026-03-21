import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../contextos/ContextoWorkspace";
import { obterEmpresas } from "../mocks/empresas";
import { TemaToggle } from "../componentes/TemaToggle";

export function SelecionarEmpresaPage() {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();
  const { selecionarEmpresa } = useWorkspace();

  useEffect(() => {
    obterEmpresas().then(setEmpresas);
  }, []);

  const handleSelecionar = (empresa) => {
    selecionarEmpresa(empresa);
    navigate("/selecionar-tenant");
  };

  return (
    <div className="selecao-page">
      <div className="selecao-page-tema">
        <TemaToggle />
      </div>
      <div className="selecao-container">
        <h1 className="selecao-titulo">Selecione a empresa</h1>
        <p className="selecao-subtitulo">
          Escolha a empresa para continuar
        </p>
        <div className="selecao-cards">
          {empresas.map((empresa) => (
            <button
              key={empresa.id}
              type="button"
              className="selecao-card selecao-card-grande"
              onClick={() => handleSelecionar(empresa)}
            >
              <span className="selecao-card-nome">{empresa.nome}</span>
              <span className="selecao-card-descricao">
                {empresa.documento}
              </span>
              <span className="selecao-card-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
