export function TabelaBase({ colunas, dados }) {
  return (
    <div className="tabela-wrapper">
      <table className="tabela-base">
      <thead>
        <tr>
          {colunas.map((col) => (
            <th key={col.chave}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dados.map((linha, idx) => (
          <tr key={linha.id ?? idx}>
            {colunas.map((col) => (
              <td key={col.chave}>
                {col.render ? col.render(linha[col.chave], linha) : linha[col.chave]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
