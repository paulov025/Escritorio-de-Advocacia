async function renderPrazos() {
  const content = document.getElementById("page-content");
  try {
    const [prazos, processos] = await Promise.all([
      api.getPrazos(),
      api.getProcessos(),
    ]);
    window._prazos = prazos;
    window._processos_list = processos;

    const vencidos = prazos.filter(
      (p) => p.status === "pendente" && daysUntil(p.data_prazo) < 0,
    );

    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Controle de <em>Prazos</em></h1>
          <p>${prazos.filter((p) => p.status === "pendente").length} prazo(s) pendente(s)${vencidos.length ? ` · <span style="color:var(--red)">⚠ ${vencidos.length} vencido(s)</span>` : ""}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn-primary" onclick="openPrazoModal()">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Novo Prazo
          </button>
        </div>
      </div>

      <div class="search-bar">
        <select class="filter-select" onchange="filterPrazosByStatus(this.value)">
          <option value="">Todos</option>
          <option value="pendente">Pendentes</option>
          <option value="concluido">Concluídos</option>
          <option value="cancelado">Cancelados</option>
        </select>
        <select class="filter-select" onchange="filterPrazosByPrioridade(this.value)">
          <option value="">Todas as prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      <div id="prazos-list">${renderPrazosList(prazos)}</div>`;
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function renderPrazosList(prazos) {
  if (!prazos.length)
    return `<div class="empty-state"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 5.5V10.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><h3>Nenhum prazo cadastrado</h3><p>Adicione prazos para não perder nenhuma data importante</p></div>`;

  return (
    `<div style="display:flex;flex-direction:column;gap:10px">` +
    prazos
      .map((p) => {
        const days = daysUntil(p.data_prazo);
        const isPast = days < 0 && p.status === "pendente";
        const urgency = isPast
          ? "red"
          : days <= 3
            ? "red"
            : days <= 7
              ? "orange"
              : "blue";
        return `
    <div class="card" style="display:flex;align-items:center;gap:16px;padding:16px 20px;${isPast ? "border-color:rgba(231,76,60,0.3)" : ""}">
      <div style="width:52px;height:52px;background:var(--${urgency}-dim);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:1.1rem;font-weight:700;color:var(--${urgency});font-family:var(--font-mono);line-height:1">${Math.abs(days)}</span>
        <span style="font-size:0.6rem;color:var(--${urgency});text-transform:uppercase">${isPast ? "atraso" : "dias"}</span>
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-weight:600;font-size:0.95rem">${p.titulo}</span>
          ${prioridadeBadge(p.prioridade)}
          <span class="badge ${p.status === "concluido" ? "badge-green" : p.status === "cancelado" ? "badge-gray" : "badge-orange"}">${p.status}</span>
        </div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-top:3px">
          ${formatDate(p.data_prazo)}${p.hora_prazo ? " às " + p.hora_prazo.slice(0, 5) : ""}
          ${p.processo_titulo ? " · " + p.processo_titulo : ""}
          ${p.descricao ? " · " + p.descricao : ""}
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        ${p.status === "pendente" ? `<button class="btn-secondary" style="padding:6px 12px;font-size:0.8rem" onclick="concluirPrazo(${p.id})">✓ Concluir</button>` : ""}
        <button class="btn-icon" onclick="openPrazoModal(${JSON.stringify(p).replace(/"/g, "&quot;")})" title="Editar">
          <svg viewBox="0 0 20 20" fill="none"><path d="M13 3L17 7L7 17H3V13L13 3Z" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <button class="btn-icon" onclick="deletePrazo(${p.id})" style="color:var(--red)">
          <svg viewBox="0 0 20 20" fill="none"><path d="M3 6H17M8 6V4H12V6M6 6V16H14V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>`;
      })
      .join("") +
    "</div>"
  );
}

function filterPrazosByStatus(s) {
  const f = s
    ? (window._prazos || []).filter((p) => p.status === s)
    : window._prazos || [];
  document.getElementById("prazos-list").innerHTML = renderPrazosList(f);
}
function filterPrazosByPrioridade(p) {
  const f = p
    ? (window._prazos || []).filter((pr) => pr.prioridade === p)
    : window._prazos || [];
  document.getElementById("prazos-list").innerHTML = renderPrazosList(f);
}

function openPrazoModal(prazo = null) {
  const processos = window._processos_list || [];
  const isEdit = !!prazo;
  showModal(
    isEdit ? "Editar Prazo" : "Novo Prazo",
    `
    <form class="modal-form" onsubmit="submitPrazo(event, ${isEdit ? prazo.id : "null"})">
      <div class="form-group"><label>Título *</label><input type="text" name="titulo" value="${prazo?.titulo || ""}" placeholder="Ex: Contestação processo 0001" required></div>
      <div class="form-row">
        <div class="form-group"><label>Data do Prazo *</label><input type="date" name="data_prazo" value="${prazo?.data_prazo?.slice(0, 10) || ""}" required></div>
        <div class="form-group"><label>Horário</label><input type="time" name="hora_prazo" value="${prazo?.hora_prazo?.slice(0, 5) || ""}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Prioridade</label>
          <select name="prioridade">
            <option value="baixa" ${prazo?.prioridade === "baixa" ? "selected" : ""}>Baixa</option>
            <option value="media" ${!prazo || prazo?.prioridade === "media" ? "selected" : ""}>Média</option>
            <option value="alta" ${prazo?.prioridade === "alta" ? "selected" : ""}>Alta</option>
            <option value="urgente" ${prazo?.prioridade === "urgente" ? "selected" : ""}>Urgente</option>
          </select>
        </div>
        <div class="form-group"><label>Status</label>
          <select name="status">
            <option value="pendente" ${!prazo || prazo?.status === "pendente" ? "selected" : ""}>Pendente</option>
            <option value="concluido" ${prazo?.status === "concluido" ? "selected" : ""}>Concluído</option>
            <option value="cancelado" ${prazo?.status === "cancelado" ? "selected" : ""}>Cancelado</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label>Processo vinculado</label>
        <select name="processo_id">
          <option value="">Selecionar processo</option>
          ${processos.map((p) => `<option value="${p.id}" ${prazo?.processo_id == p.id ? "selected" : ""}>${p.titulo}</option>`).join("")}
        </select>
      </div>
      <div class="form-group"><label>Descrição</label><textarea name="descricao" placeholder="Detalhes...">${prazo?.descricao || ""}</textarea></div>
      <div class="modal-form-actions">
        <button type="button" class="btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn-primary">${isEdit ? "Salvar" : "Adicionar Prazo"}</button>
      </div>
    </form>`,
  );
}

async function submitPrazo(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    if (id) await api.updatePrazo(id, data);
    else await api.createPrazo(data);
    closeModalDirect();
    showToast(id ? "Prazo atualizado!" : "Prazo adicionado!");
    renderPrazos();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function concluirPrazo(id) {
  try {
    const prazo = (window._prazos || []).find((p) => p.id == id);
    if (prazo) {
      await api.updatePrazo(id, { ...prazo, status: "concluido" });
      showToast("Prazo concluído!");
      renderPrazos();
    }
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deletePrazo(id) {
  if (!confirm("Excluir este prazo?")) return;
  try {
    await api.deletePrazo(id);
    showToast("Prazo excluído!");
    renderPrazos();
  } catch (err) {
    showToast(err.message, "error");
  }
}
