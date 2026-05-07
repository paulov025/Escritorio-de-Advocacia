// ═══════════════════════════════════════
// LEXFLOW — APP CORE
// ═══════════════════════════════════════

let currentPage = "dashboard";
let currentUser = null;

function enterApp(user) {
  currentUser = user;
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");

  // Set user info in sidebar
  const initials = user.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  document.getElementById("user-avatar-text").textContent = initials;
  document.getElementById("user-name-sidebar").textContent = user.nome;
  document.getElementById("user-oab-sidebar").textContent =
    user.oab || user.especialidade || "Advogado";

  navigate("dashboard");
}

function navigate(page, btn) {
  currentPage = page;

  // Update nav
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  if (btn) btn.classList.add("active");
  else {
    const target = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (target) target.classList.add("active");
  }

  // Page titles
  const titles = {
    dashboard: "Dashboard",
    processos: "Processos",
    clientes: "Clientes",
    prazos: "Prazos",
    financeiro: "Financeiro",
    documentos: "Documentos",
    calculadora: "Calculadora Jurídica",
    trabalhista: "Direitos Trabalhistas",
  };

  const actionLabels = {
    dashboard: null,
    processos: "Novo Processo",
    clientes: "Novo Cliente",
    prazos: "Novo Prazo",
    financeiro: "Novo Honorário",
    documentos: "Novo Documento",
    calculadora: null,
    trabalhista: null,
  };

  document.getElementById("page-title").textContent = titles[page] || page;
  document.getElementById("top-action-label").textContent =
    actionLabels[page] || "Novo";

  const topBtn = document.getElementById("top-action-btn");
  if (!actionLabels[page]) {
    topBtn.style.display = "none";
  } else {
    topBtn.style.display = "";
  }

  // Render page
  const content = document.getElementById("page-content");
  content.innerHTML = '<div class="loading-spinner"></div>';

  const pages = {
    dashboard: renderDashboard,
    processos: renderProcessos,
    clientes: renderClientes,
    prazos: renderPrazos,
    financeiro: renderFinanceiro,
    documentos: renderDocumentos,
    calculadora: renderCalculadora,
    trabalhista: renderTrabalhista,
  };
  if (pages[page]) pages[page]();

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("open");
  }
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function openCreateModal() {
  const actions = {
    processos: openProcessoModal,
    clientes: openClienteModal,
    prazos: openPrazoModal,
    financeiro: openHonorarioModal,
    documentos: openDocumentoModal,
  };
  if (actions[currentPage]) actions[currentPage]();
}

// ─── MODAL ───
function showModal(title, bodyHtml) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = bodyHtml;
  document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

// ─── TOAST ───
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const icons = {
    success:
      '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error:
      '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 8L12 12M12 8L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type]}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─── HELPERS ───
function formatDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
}

function formatCurrency(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + "T00:00:00");
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function statusBadgeProcesso(s) {
  const map = {
    ativo: "badge-green",
    arquivado: "badge-gray",
    encerrado: "badge-blue",
    aguardando: "badge-orange",
  };
  const labels = {
    ativo: "Ativo",
    arquivado: "Arquivado",
    encerrado: "Encerrado",
    aguardando: "Aguardando",
  };
  return `<span class="badge ${map[s] || "badge-gray"}">${labels[s] || s}</span>`;
}

function prioridadeBadge(p) {
  const map = {
    baixa: "badge-gray",
    media: "badge-blue",
    alta: "badge-orange",
    urgente: "badge-red",
  };
  const labels = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
    urgente: "Urgente",
  };
  return `<span class="badge ${map[p] || "badge-gray"}">${labels[p] || p}</span>`;
}

function honorarioStatusBadge(s) {
  const map = {
    pendente: "badge-orange",
    pago: "badge-green",
    parcial: "badge-blue",
    cancelado: "badge-gray",
  };
  const labels = {
    pendente: "Pendente",
    pago: "Pago",
    parcial: "Parcial",
    cancelado: "Cancelado",
  };
  return `<span class="badge ${map[s] || "badge-gray"}">${labels[s] || s}</span>`;
}
