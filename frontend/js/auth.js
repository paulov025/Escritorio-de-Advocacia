// ═══════════════════════════════════════
// LEXFLOW — AUTH
// ═══════════════════════════════════════

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

function showCadastro() {
  const login = document.getElementById("login-card");
  const cad = document.getElementById("cadastro-card");
  login.classList.add("slide-out");
  setTimeout(() => {
    login.classList.add("hidden");
    login.classList.remove("slide-out");
    cad.classList.remove("hidden");
    cad.classList.add("slide-in");
    setTimeout(() => cad.classList.remove("slide-in"), 400);
  }, 250);
}

function showLogin() {
  const login = document.getElementById("login-card");
  const cad = document.getElementById("cadastro-card");
  cad.classList.add("slide-out");
  setTimeout(() => {
    cad.classList.add("hidden");
    cad.classList.remove("slide-out");
    login.classList.remove("hidden");
    login.classList.add("slide-in");
    setTimeout(() => login.classList.remove("slide-in"), 400);
  }, 250);
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  const errEl = document.getElementById("login-error");
  errEl.classList.add("hidden");
  btn.classList.add("btn-loading");
  btn.disabled = true;

  try {
    const data = await api.login({
      email: document.getElementById("login-email").value,
      senha: document.getElementById("login-senha").value,
    });
    localStorage.setItem("lexflow_token", data.token);
    localStorage.setItem("lexflow_user", JSON.stringify(data.advogado));
    enterApp(data.advogado);
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove("hidden");
  } finally {
    btn.classList.remove("btn-loading");
    btn.disabled = false;
  }
});

document
  .getElementById("cadastro-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("cad-btn");
    const errEl = document.getElementById("cad-error");
    errEl.classList.add("hidden");
    btn.classList.add("btn-loading");
    btn.disabled = true;

    try {
      const data = await api.cadastro({
        nome: document.getElementById("cad-nome").value,
        email: document.getElementById("cad-email").value,
        telefone: document.getElementById("cad-tel").value,
        senha: document.getElementById("cad-senha").value,
        oab: document.getElementById("cad-oab").value,
        especialidade: document.getElementById("cad-esp").value,
      });
      localStorage.setItem("lexflow_token", data.token);
      localStorage.setItem("lexflow_user", JSON.stringify(data.advogado));
      enterApp(data.advogado);
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove("hidden");
    } finally {
      btn.classList.remove("btn-loading");
      btn.disabled = false;
    }
  });

function logout() {
  localStorage.removeItem("lexflow_token");
  localStorage.removeItem("lexflow_user");
  document.getElementById("app-screen").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
  showLogin();
}

// Check session on load
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("lexflow_token");
  const user = localStorage.getItem("lexflow_user");
  if (token && user) {
    enterApp(JSON.parse(user));
  }
});
