/**
 * Serviço de API (placeholder para futuro backend real).
 * Por enquanto, os mocks são utilizados diretamente nos componentes.
 */
export const api = {
  baseUrl: "/api",
  async get(endpoint) {
    const res = await fetch(`${this.baseUrl}${endpoint}`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
  async post(endpoint, body) {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
};
