async function renderFinanceiro() {
  const content = document.getElementById("page-content");
  try {
    const [honorarios, resumo, clientes, processos] = await Promise.all([
      api.getFinanceiro(),
      api.getFinanceiroResumo(),
      api.getClientes(),
      api.getProcessos(),
    ]);
    window._honorarios = honorarios;
    window._clientes = clientes;
    window._processos_list = processos;

    content.innerHTML = `
      <div class="page-header">
        <div><h1>Área <em>Financeira</em></h1><p>Controle de honorários e recebimentos</p></div>
        <div class="page-header-actions">
          <button class="btn-primary" onclick="openHonorarioModal()">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Novo Honorário
          </button>
        </div>
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
        <div class="stat-card green">
          <div class="stat-icon green">
            <svg viewBox="0 0 20 20" fill="none"><path d="M5 10L8.5 13.5L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value" style="font-size:1.3rem">${formatCurrency(resumo.total_recebido)}</div>
            <div class="stat-label">Total Recebido</div>
          </div>
        </div>
        <div class="stat-card orange" style="--orange-dim:rgba(243,156,18,0.12)">
          <div class="stat-icon" style="background:var(--orange-dim);color:var(--orange)">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6V7M10 13V14M7.5 9.5C7.5 8.5 8.6 8 10 8S12.5 8.5 12.5 9.5 11.4 10.5 10 10.5 7.5 11 7.5 12 8.6 13 10 13 12.5 12.5 12.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value" style="font-size:1.3rem;color:var(--orange)">${formatCurrency(resumo.total_pendente)}</div>
            <div class="stat-label">A Receber</div>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-icon blue">
            <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 9H18" stroke="currentColor" stroke-width="1.5"/><path d="M6 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${resumo.total_registros || 0}</div>
            <div class="stat-label">Total de Registros</div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead><tr><th>Descrição</th><th>Cliente</th><th>Tipo</th><th>Valor</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody id="honorarios-tbody">
            ${renderHonorariosRows(honorarios)}
          </tbody>
        </table>
        ${honorarios.length === 0 ? `<div class="empty-state"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6V14M7 9H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><h3>Nenhum honorário cadastrado</h3><p>Registre seus honorários para controlar recebimentos</p></div>` : ""}
      </div>`;
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function renderHonorariosRows(honorarios) {
  const tipoLabel = {
    fixo: "Fixo",
    percentual: "Percentual",
    hora: "Por Hora",
    exito: "Êxito",
  };
  return honorarios
    .map(
      (h) => `
    <tr>
      <td><div style="font-weight:500">${h.descricao}</div>${h.processo_titulo ? `<div style="font-size:0.75rem;color:var(--text-muted)">${h.processo_titulo}</div>` : ""}</td>
      <td style="color:var(--text-secondary)">${h.cliente_nome || "—"}</td>
      <td><span class="badge badge-purple">${tipoLabel[h.tipo] || h.tipo}</span></td>
      <td style="font-family:var(--font-mono);font-weight:600;color:var(--gold)">${formatCurrency(h.valor)}</td>
      <td style="color:var(--text-muted)">${formatDate(h.data_vencimento)}</td>
      <td>${honorarioStatusBadge(h.status)}</td>
      <td><div class="table-actions">
        ${h.status === "pendente" ? `<button class="btn-secondary" style="padding:5px 10px;font-size:0.75rem" onclick="marcarPago(${h.id})">✓ Pago</button>` : ""}
        <button class="btn-icon" onclick="openHonorarioModal(${JSON.stringify(h).replace(/"/g, "&quot;")})" title="Editar">
          <svg viewBox="0 0 20 20" fill="none"><path d="M13 3L17 7L7 17H3V13L13 3Z" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <button class="btn-icon" onclick="deleteHonorario(${h.id})" style="color:var(--red)">
          <svg viewBox="0 0 20 20" fill="none"><path d="M3 6H17M8 6V4H12V6M6 6V16H14V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div></td>
    </tr>`,
    )
    .join("");
}

function openHonorarioModal(h = null) {
  const clientes = window._clientes || [];
  const processos = window._processos_list || [];
  const isEdit = !!h;
  showModal(
    isEdit ? "Editar Honorário" : "Novo Honorário",
    `
    <form class="modal-form" onsubmit="submitHonorario(event, ${isEdit ? h.id : "null"})">
      <div class="form-group"><label>Descrição *</label><input type="text" name="descricao" value="${h?.descricao || ""}" placeholder="Ex: Honorários contratados — João Silva" required></div>
      <div class="form-row">
        <div class="form-group"><label>Tipo</label>
          <select name="tipo">
            <option value="fixo" ${!h || h?.tipo === "fixo" ? "selected" : ""}>Fixo</option>
            <option value="percentual" ${h?.tipo === "percentual" ? "selected" : ""}>Percentual</option>
            <option value="hora" ${h?.tipo === "hora" ? "selected" : ""}>Por Hora</option>
            <option value="exito" ${h?.tipo === "exito" ? "selected" : ""}>Êxito</option>
          </select>
        </div>
        <div class="form-group"><label>Valor (R$) *</label><input type="number" name="valor" value="${h?.valor || ""}" placeholder="0,00" step="0.01" min="0" required></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Cliente</label>
          <select name="cliente_id">
            <option value="">Selecionar</option>
            ${clientes.map((c) => `<option value="${c.id}" ${h?.cliente_id == c.id ? "selected" : ""}>${c.nome}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label>Processo</label>
          <select name="processo_id">
            <option value="">Selecionar</option>
            ${processos.map((p) => `<option value="${p.id}" ${h?.processo_id == p.id ? "selected" : ""}>${p.titulo}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Vencimento</label><input type="date" name="data_vencimento" value="${h?.data_vencimento?.slice(0, 10) || ""}"></div>
        <div class="form-group"><label>Status</label>
          <select name="status">
            <option value="pendente" ${!h || h?.status === "pendente" ? "selected" : ""}>Pendente</option>
            <option value="pago" ${h?.status === "pago" ? "selected" : ""}>Pago</option>
            <option value="parcial" ${h?.status === "parcial" ? "selected" : ""}>Parcial</option>
            <option value="cancelado" ${h?.status === "cancelado" ? "selected" : ""}>Cancelado</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label>Observações</label><textarea name="observacoes" placeholder="Notas...">${h?.observacoes || ""}</textarea></div>
      <div class="modal-form-actions">
        <button type="button" class="btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn-primary">${isEdit ? "Salvar" : "Cadastrar"}</button>
      </div>
    </form>`,
  );
}

async function submitHonorario(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    if (id) await api.updateHonorario(id, data);
    else await api.createHonorario(data);
    closeModalDirect();
    showToast(id ? "Honorário atualizado!" : "Honorário cadastrado!");
    renderFinanceiro();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function marcarPago(id) {
  const h = (window._honorarios || []).find((x) => x.id == id);
  if (!h) return;
  try {
    const hoje = new Date().toISOString().slice(0, 10);
    await api.updateHonorario(id, {
      ...h,
      status: "pago",
      data_pagamento: hoje,
    });
    showToast("Honorário marcado como pago! 💰");
    renderFinanceiro();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteHonorario(id) {
  if (!confirm("Excluir este honorário?")) return;
  try {
    await api.deleteHonorario(id);
    showToast("Honorário excluído!");
    renderFinanceiro();
  } catch (err) {
    showToast(err.message, "error");
  }
}
