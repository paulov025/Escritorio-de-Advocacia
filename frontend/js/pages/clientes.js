// ═══ CLIENTES ═══
async function renderClientes() {
  const content = document.getElementById("page-content");
  try {
    const clientes = await api.getClientes();
    window._clientes = clientes;
    content.innerHTML = `
      <div class="page-header">
        <div><h1>Meus <em>Clientes</em></h1><p>${clientes.length} cliente(s) cadastrado(s)</p></div>
        <div class="page-header-actions">
          <button class="btn-primary" onclick="openClienteModal()">
            <svg viewBox="0 0 20 20" fill="none"><path d="M10 3V17M3 10H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Novo Cliente
          </button>
        </div>
      </div>
      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M14 14L17.5 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <input type="text" placeholder="Buscar cliente..." oninput="filterClientes(this.value)">
        </div>
      </div>
      <div class="table-wrapper" id="clientes-table">${renderClientesTable(clientes)}</div>`;
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function renderClientesTable(clientes) {
  if (!clientes.length)
    return `<div class="empty-state"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M2 18C2 14.7 5.6 12 10 12C14.4 12 18 14.7 18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><h3>Nenhum cliente cadastrado</h3><p>Adicione seus clientes para começar</p></div>`;
  return `<table><thead><tr><th>Nome</th><th>CPF/CNPJ</th><th>E-mail</th><th>Telefone</th><th>Tipo</th><th>Ações</th></tr></thead>
  <tbody>${clientes
    .map(
      (c) => `<tr>
    <td><div style="font-weight:500">${c.nome}</div></td>
    <td style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted)">${c.cpf_cnpj || "—"}</td>
    <td style="color:var(--text-secondary)">${c.email || "—"}</td>
    <td style="color:var(--text-secondary)">${c.telefone || "—"}</td>
    <td><span class="badge ${c.tipo === "pessoa_juridica" ? "badge-purple" : "badge-blue"}">${c.tipo === "pessoa_juridica" ? "PJ" : "PF"}</span></td>
    <td><div class="table-actions">
      <button class="btn-icon" onclick="openClienteModal(${JSON.stringify(c).replace(/"/g, "&quot;")})" title="Editar">
        <svg viewBox="0 0 20 20" fill="none"><path d="M13 3L17 7L7 17H3V13L13 3Z" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <button class="btn-icon" onclick="deleteCliente(${c.id})" style="color:var(--red)">
        <svg viewBox="0 0 20 20" fill="none"><path d="M3 6H17M8 6V4H12V6M6 6V16H14V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div></td>
  </tr>`,
    )
    .join("")}</tbody></table>`;
}

function filterClientes(q) {
  const filtered = (window._clientes || []).filter(
    (c) =>
      c.nome.toLowerCase().includes(q.toLowerCase()) ||
      (c.cpf_cnpj || "").includes(q) ||
      (c.email || "").toLowerCase().includes(q.toLowerCase()),
  );
  document.getElementById("clientes-table").innerHTML =
    renderClientesTable(filtered);
}

function openClienteModal(c = null) {
  const isEdit = !!c;
  showModal(
    isEdit ? "Editar Cliente" : "Novo Cliente",
    `
    <form class="modal-form" onsubmit="submitCliente(event, ${isEdit ? c.id : "null"})">
      <div class="form-row">
        <div class="form-group">
          <label>Nome Completo *</label>
          <input type="text" name="nome" value="${c?.nome || ""}" placeholder="Nome do cliente" required>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select name="tipo">
            <option value="pessoa_fisica" ${c?.tipo === "pessoa_fisica" ? "selected" : ""}>Pessoa Física</option>
            <option value="pessoa_juridica" ${c?.tipo === "pessoa_juridica" ? "selected" : ""}>Pessoa Jurídica</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>CPF / CNPJ</label><input type="text" name="cpf_cnpj" value="${c?.cpf_cnpj || ""}" placeholder="000.000.000-00"></div>
        <div class="form-group"><label>Telefone</label><input type="tel" name="telefone" value="${c?.telefone || ""}" placeholder="(11) 99999-0000"></div>
      </div>
      <div class="form-group"><label>E-mail</label><input type="email" name="email" value="${c?.email || ""}" placeholder="cliente@email.com"></div>
      <div class="form-group"><label>Endereço</label><input type="text" name="endereco" value="${c?.endereco || ""}" placeholder="Rua, número, bairro, cidade"></div>
      <div class="form-group"><label>Observações</label><textarea name="observacoes" placeholder="Notas sobre o cliente...">${c?.observacoes || ""}</textarea></div>
      <div class="modal-form-actions">
        <button type="button" class="btn-secondary" onclick="closeModalDirect()">Cancelar</button>
        <button type="submit" class="btn-primary">${isEdit ? "Salvar" : "Cadastrar Cliente"}</button>
      </div>
    </form>`,
  );
}

async function submitCliente(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    if (id) await api.updateCliente(id, data);
    else await api.createCliente(data);
    closeModalDirect();
    showToast(id ? "Cliente atualizado!" : "Cliente cadastrado!");
    renderClientes();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteCliente(id) {
  if (!confirm("Excluir este cliente?")) return;
  try {
    await api.deleteCliente(id);
    showToast("Cliente excluído!");
    renderClientes();
  } catch (err) {
    showToast(err.message, "error");
  }
}
