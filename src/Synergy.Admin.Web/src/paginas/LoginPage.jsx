import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacao } from "../contextos/ContextoAutenticacao";
import { TemaToggle } from "../componentes/TemaToggle";

export function LoginPage() {
  const { login } = useAutenticacao();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");
    if (login(usuario, senha)) {
      navigate("/selecionar-empresa");
    } else {
      setErro("Usuário ou senha inválidos. Use admin/admin para acesso temporário.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-tema">
        <TemaToggle />
      </div>
      <div className="login-card">
        <h1 className="login-titulo">Synergy Admin</h1>
        <p className="login-subtitulo">Portal Administrativo da Plataforma Synergy</p>
        <form onSubmit={handleSubmit}>
          {erro && <div className="login-erro">{erro}</div>}
          <div className="form-grupo">
            <label className="form-label" htmlFor="usuario">
              Usuário
            </label>
            <input
              id="usuario"
              type="text"
              className="form-input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className="form-grupo">
            <label className="form-label" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className="form-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="admin"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primario" style={{ width: "100%", marginTop: "0.5rem" }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
