async function renderDocumentos() {
  const content = document.getElementById("page-content");
  try {
    const [documentos, clientes, processos] = await Promise.all([
      api.getDocumentos(),
      api.getClientes(),
      api.getProcessos(),
    ]);
    window._documentos = documentos;
    window._clientes = clientes;
    window._processos_list = processos;

    content.innerHTML = `
      <div class="page-header">
        <div><h1>Gestão de <em>Documentos</em></h1><p>${documentos.length} documento(s) registrado(s)</p></div>
        <div class="page-header-actions">
          <button class="btn-primary" onclick="openDocumentoModal()">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Novo Documento
          </button>
        </div>
      </div>

      <div id="docs-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
        ${renderDocumentosGrid(documentos)}
      </div>`;
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function renderDocumentosGrid(docs) {
  if (!docs.length)
    return `
    <div class="empty-state" style="grid-column:1/-1">
      <svg viewBox="0 0 20 20" fill="none"><path d="M5 2H12L17 7V18C17 18.6 16.6 19 16 19H5C4.4 19 4 18.6 4 18V3C4 2.4 4.4 2 5 2Z" stroke="currentColor" stroke-width="1.5"/><path d="M12 2V7H17" stroke="currentColor" stroke-width="1.5"/></svg>
      <h3>Nenhum documento registrado</h3>
      <p>Organize seus documentos jurídicos aqui</p>
    </div>`;

  const tipoIcons = {
    peticao: "📄",
    contrato: "📋",
    procuracao: "✍️",
    sentenca: "⚖️",
    recurso: "📤",
    acordo: "🤝",
    outros: "📎",
  };

  return docs
    .map(
      (d) => `
    <div class="card" style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
        <div style="font-size:2rem;line-height:1">${tipoIcons[d.tipo] || "📎"}</div>
        <div style="display:flex;gap:6px">
          <button class="btn-icon" onclick="deleteDocumento(${d.id})" style="color:var(--red);width:28px;height:28px">
            <svg viewBox="0 0 20 20" fill="none"><path d="M3 6H17M8 6V4H12V6M6 6V16H14V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
      <div>
        <div style="font-weight:600;font-size:0.95rem;margin-bottom:4px">${d.titulo}</div>
        ${d.tipo ? `<span class="badge badge-blue" style="font-size:0.7rem">${d.tipo}</span>` : ""}
      </div>
      <div style="font-size:0.8rem;color:var(--text-muted);display:flex;flex-direction:column;gap:3px">
        ${d.cliente_nome ? `<span>👤 ${d.cliente_nome}</span>` : ""}
        ${d.processo_titulo ? `<span>⚖️ ${d.processo_titulo}</span>` : ""}
        ${d.nome_arquivo ? `<span>📁 ${d.nome_arquivo}</span>` : ""}
        <span>🗓 ${new Date(d.created_at).toLocaleDateString("pt-BR")}</span>
      </div>
      ${d.descricao ? `<p style="font-size:0.8rem;color:var(--text-secondary);border-top:1px solid var(--border-light);padding-top:8px;margin:0">${d.descricao}</p>` : ""}
    </div>`,
    )
    .join("");
}

function openDocumentoModal() {
  const clientes = window._clientes || [];
  const processos = window._processos_list || [];
  showModal(
    "Novo Documento",
    `
    <form class="modal-form" onsubmit="submitDocumento(event)">
      <div class="form-group"><label>Título *</label><input type="text" name="titulo" placeholder="Ex: Petição Inicial — Ação Trabalhista" required></div>
      <div class="form-row">
        <div class="form-group"><label>Tipo</label>
          <select name="tipo">
            <option value="">Selecionar tipo</option>
            <option value="peticao">Petição</option>
            <option value="contrato">Contrato</option>
            <option value="procuracao">Procuração</option>
            <option value="sentenca">Sentença</option>
            <option value="recurso">Recurso</option>
            <option value="acordo">Acordo</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div class="form-group"><label>Nome do Arquivo</label><input type="text" name="nome_arquivo" placeholder="peticao_inicial.pdf"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Cliente</label>
          <select name="cliente_id">
            <option value="">Selecionar</option>
            ${clientes.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label>Processo</label>
          <select name="processo_id">
            <option value="">Selecionar</option>
            ${processos.map((p) => `<option value="${p.id}">${p.titulo}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-group"><label>Descrição / Observações</label><textarea name="descricao" placeholder="Notas sobre o documento..."></textarea></div>
      <div class="modal-form-actions">
        <button type="button" class="btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn-primary">Registrar Documento</button>
      </div>
    </form>`,
  );
}

async function submitDocumento(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    await api.createDocumento(data);
    closeModalDirect();
    showToast("Documento registrado!");
    renderDocumentos();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteDocumento(id) {
  if (!confirm("Excluir este documento?")) return;
  try {
    await api.deleteDocumento(id);
    showToast("Documento excluído!");
    renderDocumentos();
  } catch (err) {
    showToast(err.message, "error");
  }
}
