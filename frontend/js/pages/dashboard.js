async function renderDashboard() {
  const content = document.getElementById("page-content");
  try {
    const data = await api.dashboard();
    const { stats, prazosProximos, processosRecentes } = data;

    const prazosVencidos = stats.prazos.vencidos || 0;
    const badge = document.getElementById("prazos-badge");
    if (prazosVencidos > 0) {
      badge.textContent = prazosVencidos;
      badge.classList.add("visible");
    } else badge.classList.remove("visible");

    content.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Olá, <em>${currentUser.nome.split(" ")[0]}</em></h1>
          <p>Resumo do seu escritório — ${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card blue" style="cursor:pointer" onclick="navigate('processos')">
          <div class="stat-icon blue">
            <svg viewBox="0 0 20 20" fill="none"><path d="M4 4H16C16.6 4 17 4.4 17 5V15C17 15.6 16.6 16 16 16H4C3.4 16 3 15.6 3 15V5C3 4.4 3.4 4 4 4Z" stroke="currentColor" stroke-width="1.5"/><path d="M7 8H13M7 11H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.processos.total || 0}</div>
            <div class="stat-label">Processos Totais</div>
            <small style="color:var(--text-muted);font-size:0.75rem">${stats.processos.ativos || 0} ativos</small>
          </div>
        </div>

        <div class="stat-card gold" style="cursor:pointer" onclick="navigate('clientes')">
          <div class="stat-icon gold">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M2 18C2 14.7 5.6 12 10 12C14.4 12 18 14.7 18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.clientes.total || 0}</div>
            <div class="stat-label">Clientes</div>
            <small style="color:var(--text-muted);font-size:0.75rem">cadastrados</small>
          </div>
        </div>

        <div class="stat-card ${prazosVencidos > 0 ? "red" : "green"}" style="cursor:pointer" onclick="navigate('prazos')">
          <div class="stat-icon ${prazosVencidos > 0 ? "red" : "green"}">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 5.5V10.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.prazos.proximos || 0}</div>
            <div class="stat-label">Prazos Próximos</div>
            ${prazosVencidos > 0 ? `<small style="color:var(--red);font-size:0.75rem">⚠ ${prazosVencidos} vencido(s)</small>` : '<small style="color:var(--text-muted);font-size:0.75rem">sem vencidos</small>'}
          </div>
        </div>

        <div class="stat-card green" style="cursor:pointer" onclick="navigate('financeiro')">
          <div class="stat-icon green">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6V7M10 13V14M7.5 9C7.5 8 8.6 7.5 10 7.5C11.4 7.5 12.5 8.2 12.5 9.2C12.5 10.2 11.4 10.5 10 10.5C8.6 10.5 7.5 11 7.5 12C7.5 13 8.6 13.5 10 13.5C11.4 13.5 12.5 13 12.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value" style="font-size:1.2rem">${formatCurrency(stats.financeiro.recebido)}</div>
            <div class="stat-label">Honorários Recebidos</div>
            <small style="color:var(--text-muted);font-size:0.75rem">${formatCurrency(stats.financeiro.pendente)} pendente</small>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 5.5V10.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Prazos Próximos
          </div>
          ${
            prazosProximos.length === 0
              ? `
            <div class="empty-state" style="padding:30px 0">
              <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 5.5V10.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <p>Nenhum prazo próximo</p>
            </div>
          `
              : prazosProximos
                  .map((p) => {
                    const days = daysUntil(p.data_prazo);
                    const urgency =
                      days <= 3 ? "red" : days <= 7 ? "orange" : "blue";
                    return `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-light)">
              <div style="width:44px;height:44px;background:var(--${urgency}-dim);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-size:1rem;font-weight:700;color:var(--${urgency});font-family:var(--font-mono);line-height:1">${days}</span>
                <span style="font-size:0.55rem;color:var(--${urgency});text-transform:uppercase">dias</span>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:0.875rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.titulo}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${formatDate(p.data_prazo)} ${p.processo_titulo ? "· " + p.processo_titulo : ""}</div>
              </div>
              ${prioridadeBadge(p.prioridade)}
            </div>`;
                  })
                  .join("")
          }
        </div>

        <div class="card">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 4H16C16.6 4 17 4.4 17 5V15C17 15.6 16.6 16 16 16H4C3.4 16 3 15.6 3 15V5C3 4.4 3.4 4 4 4Z" stroke="currentColor" stroke-width="1.5"/></svg>
            Processos Recentes
          </div>
          ${
            processosRecentes.length === 0
              ? `
            <div class="empty-state" style="padding:30px 0">
              <p>Nenhum processo cadastrado</p>
            </div>
          `
              : processosRecentes
                  .map(
                    (p) => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-light)">
              <div style="flex:1;min-width:0">
                <div style="font-size:0.875rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.titulo}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${p.cliente_nome || "Sem cliente"} ${p.numero_processo ? "· " + p.numero_processo : ""}</div>
              </div>
              ${statusBadgeProcesso(p.status)}
            </div>
          `,
                  )
                  .join("")
          }
        </div>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}
