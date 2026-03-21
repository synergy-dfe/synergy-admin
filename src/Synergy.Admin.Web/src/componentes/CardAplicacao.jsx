export function CardAplicacao({ nome, tipo, chave, status, rotaBasePortal, urlBase }) {
  return (
    <div className="card">
      <div className="card-titulo">{nome}</div>
      <div style={{ fontSize: "0.875rem", color: "var(--cor-texto-claro)" }}>
        <span>Chave: {chave}</span>
        <span style={{ marginLeft: "1rem" }}>Tipo: {tipo}</span>
        <span style={{ marginLeft: "1rem" }}>Status: {status}</span>
        {rotaBasePortal && (
          <div style={{ marginTop: "0.25rem" }}>Rota: {rotaBasePortal}</div>
        )}
        {urlBase && (
          <div style={{ marginTop: "0.25rem" }}>URL: {urlBase}</div>
        )}
      </div>
    </div>
  );
}
