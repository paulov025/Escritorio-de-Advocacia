function renderCalculadora() {
  const content = document.getElementById("page-content");
  content.innerHTML = `
    <div class="page-header">
      <div><h1>Calculadora <em>Jurídica</em></h1><p>Ferramentas de cálculo para o dia a dia</p></div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px">

      <!-- CORREÇÃO MONETÁRIA -->
      <div class="card">
        <div class="section-title" style="font-size:1rem;margin-bottom:16px">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6V7M10 13V14M7.5 9.5H12.5M7.5 11.5H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Correção Monetária (INPC)
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group"><label>Valor Original (R$)</label><input type="number" id="cm-valor" placeholder="0,00" step="0.01" style="padding:10px 14px"></div>
          <div class="form-row">
            <div class="form-group"><label>Data Inicial</label><input type="date" id="cm-data-ini" style="padding:10px 12px"></div>
            <div class="form-group"><label>Data Final</label><input type="date" id="cm-data-fim" value="${new Date().toISOString().slice(0, 10)}" style="padding:10px 12px"></div>
          </div>
          <div class="form-group"><label>Taxa Anual INPC (%)</label><input type="number" id="cm-taxa" value="5.5" step="0.1" style="padding:10px 14px"></div>
          <button class="btn-primary" onclick="calcularCorrecao()" style="width:100%">Calcular</button>
          <div id="cm-resultado" class="calc-result hidden"></div>
        </div>
      </div>

      <!-- JUROS DE MORA -->
      <div class="card">
        <div class="section-title" style="font-size:1rem;margin-bottom:16px">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 16L16 4M8 4H16V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Juros de Mora (1% a.m.)
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group"><label>Valor Principal (R$)</label><input type="number" id="jm-valor" placeholder="0,00" step="0.01" style="padding:10px 14px"></div>
          <div class="form-row">
            <div class="form-group"><label>Data Inicial</label><input type="date" id="jm-data-ini" style="padding:10px 12px"></div>
            <div class="form-group"><label>Data Final</label><input type="date" id="jm-data-fim" value="${new Date().toISOString().slice(0, 10)}" style="padding:10px 12px"></div>
          </div>
          <div class="form-group"><label>Taxa Mensal (%)</label><input type="number" id="jm-taxa" value="1" step="0.01" style="padding:10px 14px"></div>
          <button class="btn-primary" onclick="calcularJurosMora()" style="width:100%">Calcular</button>
          <div id="jm-resultado" class="calc-result hidden"></div>
        </div>
      </div>

      <!-- HONORÁRIOS PERCENTUAL -->
      <div class="card">
        <div class="section-title" style="font-size:1rem;margin-bottom:16px">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 13L13 7M8 8H8.01M12 12H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Honorários por Percentual
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group"><label>Valor da Causa (R$)</label><input type="number" id="hp-causa" placeholder="0,00" step="0.01" style="padding:10px 14px"></div>
          <div class="form-group"><label>Percentual de Honorários (%)</label><input type="number" id="hp-pct" value="20" step="0.5" min="0" max="100" style="padding:10px 14px"></div>
          <button class="btn-primary" onclick="calcularHonorarios()" style="width:100%">Calcular</button>
          <div id="hp-resultado" class="calc-result hidden"></div>
        </div>
      </div>

      <!-- RESCISÃO TRABALHISTA -->
      <div class="card">
        <div class="section-title" style="font-size:1rem;margin-bottom:16px">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 10H13M7 7H10M7 13H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Rescisão Trabalhista Simplificada
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="form-group"><label>Salário Bruto (R$)</label><input type="number" id="rt-salario" placeholder="0,00" step="0.01" style="padding:10px 14px"></div>
          <div class="form-row">
            <div class="form-group"><label>Data Admissão</label><input type="date" id="rt-admissao" style="padding:10px 12px"></div>
            <div class="form-group"><label>Data Demissão</label><input type="date" id="rt-demissao" value="${new Date().toISOString().slice(0, 10)}" style="padding:10px 12px"></div>
          </div>
          <div class="form-group"><label>Tipo de Demissão</label>
            <select id="rt-tipo" style="padding:10px 14px">
              <option value="sem_justa">Sem Justa Causa</option>
              <option value="pedido">Pedido de Demissão</option>
              <option value="com_justa">Com Justa Causa</option>
            </select>
          </div>
          <button class="btn-primary" onclick="calcularRescisao()" style="width:100%">Calcular Rescisão</button>
          <div id="rt-resultado" class="calc-result hidden"></div>
        </div>
      </div>

    </div>

    <style>
    .calc-result {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
    }
    .calc-result .result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--border-light);
    }
    .calc-result .result-row:last-child { border-bottom: none; }
    .calc-result .result-label { color: var(--text-muted); }
    .calc-result .result-value { font-family: var(--font-mono); font-weight: 600; }
    .calc-result .result-total {
      display: flex; justify-content: space-between;
      padding: 10px 0 0; margin-top: 6px;
      border-top: 2px solid var(--gold);
      font-weight: 700;
    }
    .calc-result .result-total .result-value { color: var(--gold); font-size: 1.1rem; }
    </style>
  `;
}

function calcularCorrecao() {
  const valor = parseFloat(document.getElementById("cm-valor").value);
  const ini = document.getElementById("cm-data-ini").value;
  const fim = document.getElementById("cm-data-fim").value;
  const taxa = parseFloat(document.getElementById("cm-taxa").value) / 100;
  const el = document.getElementById("cm-resultado");

  if (!valor || !ini || !fim) {
    showToast("Preencha todos os campos", "error");
    return;
  }

  const dias = Math.max(
    0,
    Math.ceil((new Date(fim) - new Date(ini)) / 86400000),
  );
  const fator = Math.pow(1 + taxa, dias / 365);
  const corrigido = valor * fator;
  const diferenca = corrigido - valor;

  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Valor Original</span><span class="result-value">${formatCurrency(valor)}</span></div>
    <div class="result-row"><span class="result-label">Período</span><span class="result-value">${dias} dias</span></div>
    <div class="result-row"><span class="result-label">Fator de Correção</span><span class="result-value">${fator.toFixed(6)}</span></div>
    <div class="result-row"><span class="result-label">Correção</span><span class="result-value" style="color:var(--green)">+ ${formatCurrency(diferenca)}</span></div>
    <div class="result-total"><span>Valor Corrigido</span><span class="result-value">${formatCurrency(corrigido)}</span></div>`;
}

function calcularJurosMora() {
  const valor = parseFloat(document.getElementById("jm-valor").value);
  const ini = document.getElementById("jm-data-ini").value;
  const fim = document.getElementById("jm-data-fim").value;
  const taxaMensal = parseFloat(document.getElementById("jm-taxa").value) / 100;
  const el = document.getElementById("jm-resultado");

  if (!valor || !ini || !fim) {
    showToast("Preencha todos os campos", "error");
    return;
  }

  const dias = Math.max(
    0,
    Math.ceil((new Date(fim) - new Date(ini)) / 86400000),
  );
  const meses = dias / 30;
  const juros = valor * taxaMensal * meses;
  const total = valor + juros;

  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Valor Principal</span><span class="result-value">${formatCurrency(valor)}</span></div>
    <div class="result-row"><span class="result-label">Período</span><span class="result-value">${dias} dias (${meses.toFixed(2)} meses)</span></div>
    <div class="result-row"><span class="result-label">Juros de Mora</span><span class="result-value" style="color:var(--orange)">+ ${formatCurrency(juros)}</span></div>
    <div class="result-total"><span>Total com Juros</span><span class="result-value">${formatCurrency(total)}</span></div>`;
}

function calcularHonorarios() {
  const causa = parseFloat(document.getElementById("hp-causa").value);
  const pct = parseFloat(document.getElementById("hp-pct").value);
  const el = document.getElementById("hp-resultado");

  if (!causa || !pct) {
    showToast("Preencha todos os campos", "error");
    return;
  }

  const honorarios = causa * (pct / 100);

  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Valor da Causa</span><span class="result-value">${formatCurrency(causa)}</span></div>
    <div class="result-row"><span class="result-label">Percentual</span><span class="result-value">${pct}%</span></div>
    <div class="result-total"><span>Honorários</span><span class="result-value">${formatCurrency(honorarios)}</span></div>`;
}

function calcularRescisao() {
  const salario = parseFloat(document.getElementById("rt-salario").value);
  const admissao = document.getElementById("rt-admissao").value;
  const demissao = document.getElementById("rt-demissao").value;
  const tipo = document.getElementById("rt-tipo").value;
  const el = document.getElementById("rt-resultado");

  if (!salario || !admissao || !demissao) {
    showToast("Preencha todos os campos", "error");
    return;
  }

  const di = new Date(admissao),
    df = new Date(demissao);
  const anosCompletos = df.getFullYear() - di.getFullYear();
  const mesesCompletos =
    (df.getFullYear() - di.getFullYear()) * 12 +
    (df.getMonth() - di.getMonth());
  const diasMes = df.getDate();

  const saldoSalario = salario * (diasMes / 30);
  const avisoPrevia = tipo !== "com_justa" ? salario : 0;
  const feriasVencidas =
    anosCompletos >= 1 ? salario * Math.floor(anosCompletos) : 0;
  const feriasProp =
    (salario / 12) *
    (df.getMonth() -
      (anosCompletos > 0 ? di.getMonth() + anosCompletos * 12 : di.getMonth()));
  const feriasAbono = (feriasVencidas + Math.max(0, feriasProp)) * (1 / 3);
  const decimoTerceiro = (salario / 12) * df.getMonth();
  const fgts = tipo === "sem_justa" ? salario * mesesCompletos * 0.08 * 0.4 : 0;

  const total =
    saldoSalario +
    avisoPrevia +
    feriasVencidas +
    Math.max(0, feriasProp) +
    feriasAbono +
    decimoTerceiro +
    fgts;

  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="result-row"><span class="result-label">Saldo de Salário</span><span class="result-value">${formatCurrency(saldoSalario)}</span></div>
    ${tipo !== "com_justa" ? `<div class="result-row"><span class="result-label">Aviso Prévio</span><span class="result-value">${formatCurrency(avisoPrevia)}</span></div>` : ""}
    ${feriasVencidas > 0 ? `<div class="result-row"><span class="result-label">Férias Vencidas</span><span class="result-value">${formatCurrency(feriasVencidas)}</span></div>` : ""}
    <div class="result-row"><span class="result-label">Férias Proporcionais</span><span class="result-value">${formatCurrency(Math.max(0, feriasProp))}</span></div>
    <div class="result-row"><span class="result-label">1/3 de Férias</span><span class="result-value">${formatCurrency(feriasAbono)}</span></div>
    <div class="result-row"><span class="result-label">13º Proporcional</span><span class="result-value">${formatCurrency(decimoTerceiro)}</span></div>
    ${tipo === "sem_justa" ? `<div class="result-row"><span class="result-label">Multa FGTS (40%)</span><span class="result-value" style="color:var(--green)">${formatCurrency(fgts)}</span></div>` : ""}
    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:6px">* Cálculo estimado. Consulte sempre a legislação vigente.</div>
    <div class="result-total"><span>Total Estimado</span><span class="result-value">${formatCurrency(total)}</span></div>`;
}
