async function renderProcessos() {
  const content = document.getElementById("page-content");
  try {
    const processos = await api.getProcessos();
    const clientes = await api.getClientes();

    window._clientes = clientes;

    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Processos <em>Jurídicos</em></h1>
          <p>${processos.length} processo(s) cadastrado(s)</p>
        </div>
        <div class="page-header-actions">
          <button class="btn-primary" onclick="openProcessoModal()">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Novo Processo
          </button>
        </div>
      </div>

      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M14 14L17.5 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <input type="text" placeholder="Buscar processo..." oninput="filterProcessos(this.value)">
        </div>
        <select class="filter-select" onchange="filterProcessosByStatus(this.value)">
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="arquivado">Arquivado</option>
          <option value="encerrado">Encerrado</option>
          <option value="aguardando">Aguardando</option>
        </select>
      </div>

      <div class="table-wrapper" id="processos-table">
        ${renderProcessosTable(processos)}
      </div>
    `;
    window._processos = processos;
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function renderProcessosTable(processos) {
  if (!processos.length)
    return `
    <div class="empty-state">
      <svg viewBox="0 0 20 20" fill="none"><path d="M4 4H16C16.6 4 17 4.4 17 5V15C17 15.6 16.6 16 16 16H4C3.4 16 3 15.6 3 15V5C3 4.4 3.4 4 4 4Z" stroke="currentColor" stroke-width="1.5"/></svg>
      <h3>Nenhum processo encontrado</h3>
      <p>Adicione seu primeiro processo clicando em "Novo Processo"</p>
    </div>`;

  const areaLabel = {
    trabalhista: "Trabalhista",
    civil: "Civil",
    criminal: "Criminal",
    tributario: "Tributário",
    previdenciario: "Previdenciário",
    familia: "Família",
    outros: "Outros",
  };

  return `<table>
    <thead><tr>
      <th>Processo</th><th>Cliente</th><th>Área</th><th>Status</th><th>Abertura</th><th>Ações</th>
    </tr></thead>
    <tbody>${processos
      .map(
        (p) => `
      <tr>
        <td>
          <div style="font-weight:500">${p.titulo}</div>
          ${p.numero_processo ? `<div style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono)">${p.numero_processo}</div>` : ""}
        </td>
        <td>${p.cliente_nome || '<span style="color:var(--text-muted)">—</span>'}</td>
        <td><span class="badge badge-purple">${areaLabel[p.area] || p.area}</span></td>
        <td>${statusBadgeProcesso(p.status)}</td>
        <td style="color:var(--text-muted)">${formatDate(p.data_abertura)}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" onclick="openProcessoModal(${JSON.stringify(p).replace(/"/g, "&quot;")})" title="Editar">
              <svg viewBox="0 0 20 20" fill="none"><path d="M13 3L17 7L7 17H3V13L13 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </button>
            <button class="btn-icon" onclick="deleteProcesso(${p.id})" title="Excluir" style="color:var(--red)">
              <svg viewBox="0 0 20 20" fill="none"><path d="M3 6H17M8 6V4H12V6M6 6V16C6 16.6 6.4 17 7 17H13C13.6 17 14 16.6 14 16V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </td>
      </tr>`,
      )
      .join("")}
    </tbody>
  </table>`;
}

function filterProcessos(q) {
  const filtered = (window._processos || []).filter(
    (p) =>
      p.titulo.toLowerCase().includes(q.toLowerCase()) ||
      (p.numero_processo || "").includes(q) ||
      (p.cliente_nome || "").toLowerCase().includes(q.toLowerCase()),
  );
  document.getElementById("processos-table").innerHTML =
    renderProcessosTable(filtered);
}

function filterProcessosByStatus(status) {
  const filtered = status
    ? (window._processos || []).filter((p) => p.status === status)
    : window._processos || [];
  document.getElementById("processos-table").innerHTML =
    renderProcessosTable(filtered);
}

function openProcessoModal(processo = null) {
  const clientes = window._clientes || [];
  const clienteOptions = clientes
    .map(
      (c) =>
        `<option value="${c.id}" ${processo?.cliente_id == c.id ? "selected" : ""}>${c.nome}</option>`,
    )
    .join("");
  const isEdit = !!processo;

  showModal(
    isEdit ? "Editar Processo" : "Novo Processo",
    `
    <form class="modal-form" onsubmit="submitProcesso(event, ${isEdit ? processo.id : "null"})">
      <div class="form-group">
        <label>Título do Processo *</label>
        <input type="text" name="titulo" value="${processo?.titulo || ""}" placeholder="Ex: Rescisão Contratual — João Silva" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Número do Processo</label>
          <input type="text" name="numero_processo" value="${processo?.numero_processo || ""}" placeholder="0000000-00.0000.0.00.0000">
        </div>
        <div class="form-group">
          <label>Cliente</label>
          <select name="cliente_id">
            <option value="">Selecionar cliente</option>
            ${clienteOptions}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Área Jurídica</label>
          <select name="area">
            <option value="trabalhista" ${processo?.area === "trabalhista" ? "selected" : ""}>Trabalhista</option>
            <option value="civil" ${processo?.area === "civil" ? "selected" : ""}>Civil</option>
            <option value="criminal" ${processo?.area === "criminal" ? "selected" : ""}>Criminal</option>
            <option value="tributario" ${processo?.area === "tributario" ? "selected" : ""}>Tributário</option>
            <option value="previdenciario" ${processo?.area === "previdenciario" ? "selected" : ""}>Previdenciário</option>
            <option value="familia" ${processo?.area === "familia" ? "selected" : ""}>Família</option>
            <option value="outros" ${processo?.area === "outros" ? "selected" : ""}>Outros</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="ativo" ${processo?.status === "ativo" ? "selected" : ""}>Ativo</option>
            <option value="aguardando" ${processo?.status === "aguardando" ? "selected" : ""}>Aguardando</option>
            <option value="arquivado" ${processo?.status === "arquivado" ? "selected" : ""}>Arquivado</option>
            <option value="encerrado" ${processo?.status === "encerrado" ? "selected" : ""}>Encerrado</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Tribunal</label>
          <input type="text" name="tribunal" value="${processo?.tribunal || ""}" placeholder="TRT 2ª Região">
        </div>
        <div class="form-group">
          <label>Vara</label>
          <input type="text" name="vara" value="${processo?.vara || ""}" placeholder="3ª Vara do Trabalho">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Parte Contrária</label>
          <input type="text" name="parte_contraria" value="${processo?.parte_contraria || ""}" placeholder="Nome da parte contrária">
        </div>
        <div class="form-group">
          <label>Data de Abertura</label>
          <input type="date" name="data_abertura" value="${processo?.data_abertura?.slice(0, 10) || ""}">
        </div>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea name="descricao" placeholder="Detalhes do processo...">${processo?.descricao || ""}</textarea>
      </div>
      <div class="modal-form-actions">
        <button type="button" class="btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn-primary">${isEdit ? "Salvar Alterações" : "Criar Processo"}</button>
      </div>
    </form>
  `,
  );
}

async function submitProcesso(e, id) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  try {
    if (id) await api.updateProcesso(id, data);
    else await api.createProcesso(data);
    closeModalDirect();
    showToast(id ? "Processo atualizado!" : "Processo criado com sucesso!");
    renderProcessos();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteProcesso(id) {
  if (!confirm("Excluir este processo?")) return;
  try {
    await api.deleteProcesso(id);
    showToast("Processo excluído!");
    renderProcessos();
  } catch (err) {
    showToast(err.message, "error");
  }
}
