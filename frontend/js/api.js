// ═══════════════════════════════════════
// LEXFLOW — API CLIENT
// ═══════════════════════════════════════

const API_BASE = "/api";

const api = {
  async request(method, endpoint, data = null) {
    const token = localStorage.getItem("lexflow_token");
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    if (data) opts.body = JSON.stringify(data);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, opts);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro na requisição");
      return json;
    } catch (err) {
      throw err;
    }
  },

  get: (ep) => api.request("GET", ep),
  post: (ep, d) => api.request("POST", ep, d),
  put: (ep, d) => api.request("PUT", ep, d),
  delete: (ep) => api.request("DELETE", ep),

  // Auth
  login: (d) => api.post("/auth/login", d),
  cadastro: (d) => api.post("/auth/cadastro", d),
  perfil: () => api.get("/auth/perfil"),

  // Dashboard
  dashboard: () => api.get("/dashboard"),

  // Processos
  getProcessos: (params = "") => api.get(`/processos${params}`),
  createProcesso: (d) => api.post("/processos", d),
  updateProcesso: (id, d) => api.put(`/processos/${id}`, d),
  deleteProcesso: (id) => api.delete(`/processos/${id}`),

  // Clientes
  getClientes: (params = "") => api.get(`/clientes${params}`),
  createCliente: (d) => api.post("/clientes", d),
  updateCliente: (id, d) => api.put(`/clientes/${id}`, d),
  deleteCliente: (id) => api.delete(`/clientes/${id}`),

  // Prazos
  getPrazos: (params = "") => api.get(`/prazos${params}`),
  createPrazo: (d) => api.post("/prazos", d),
  updatePrazo: (id, d) => api.put(`/prazos/${id}`, d),
  deletePrazo: (id) => api.delete(`/prazos/${id}`),

  // Financeiro
  getFinanceiro: () => api.get("/financeiro"),
  getFinanceiroResumo: () => api.get("/financeiro/resumo"),
  createHonorario: (d) => api.post("/financeiro", d),
  updateHonorario: (id, d) => api.put(`/financeiro/${id}`, d),
  deleteHonorario: (id) => api.delete(`/financeiro/${id}`),

  // Documentos
  getDocumentos: () => api.get("/documentos"),
  createDocumento: (d) => api.post("/documentos", d),
  deleteDocumento: (id) => api.delete(`/documentos/${id}`),
};
