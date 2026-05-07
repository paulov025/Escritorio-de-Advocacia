function renderTrabalhista() {
  const content = document.getElementById("page-content");
  content.innerHTML = `
    <div class="page-header">
      <div><h1>Direitos <em>Trabalhistas</em></h1><p>Referência rápida da legislação trabalhista brasileira</p></div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px">

      ${trabCard("⏰", "Jornada de Trabalho", "badge-blue", [
        ["Jornada máxima diária", "8 horas (Art. 58 CLT)"],
        ["Jornada máxima semanal", "44 horas (Art. 58 CLT)"],
        ["Hora extra", "Acréscimo mínimo de 50%"],
        ["Hora extra (feriado/domingo)", "Acréscimo mínimo de 100%"],
        ["Intervalo intrajornada (>6h)", "Mínimo 1 hora (Art. 71)"],
        ["Intervalo entre jornadas", "Mínimo 11 horas consecutivas"],
        ["Banco de horas", "Acordado em convenção coletiva"],
      ])}

      ${trabCard("💰", "Salário e Remuneração", "badge-gold", [
        ["Salário Mínimo Nacional (2024)", "R$ 1.412,00"],
        ["Salário mínimo hora", "R$ 6,42"],
        ["13º Salário", "1/12 por mês trabalhado"],
        ["Prazo pagto 13º (1ª parcela)", "Até 30/11 de cada ano"],
        ["Prazo pagto 13º (2ª parcela)", "Até 20/12 de cada ano"],
        ["Equiparação salarial", "Art. 461 CLT"],
        ["Desvio de função", "Direito à diferença salarial"],
      ])}

      ${trabCard("🌴", "Férias", "badge-green", [
        ["Período aquisitivo", "12 meses de trabalho"],
        ["Duração das férias", "30 dias (sem faltas)"],
        ["Férias com 5 a 14 faltas", "24 dias corridos"],
        ["Férias com 15 a 23 faltas", "18 dias corridos"],
        ["Férias com 24 a 32 faltas", "12 dias corridos"],
        ["Abono constitucional (1/3)", "Obrigatório sobre o valor"],
        ["Férias coletivas", "Comunicar DRT 15 dias antes"],
        ["Férias vendidas", "Até 1/3 do período"],
      ])}

      ${trabCard("📋", "Rescisão Contratual", "badge-orange", [
        ["Aviso prévio mínimo", "30 dias (+ 3 dias/ano até 90)"],
        ["Sem justa causa — FGTS", "Multa de 40% sobre saldo"],
        ["Saldo de salário", "Dias trabalhados no mês"],
        ["Férias proporcionais", "1/12 por mês trabalhado"],
        ["13º proporcional", "1/12 por mês trabalhado"],
        ["Prazo pagamento rescisão", "Até 10 dias após aviso"],
        ["Justa causa", "Perde aviso, férias (se vencidas não)"],
        ["Rescisão indireta", "Culpa do empregador (Art. 483)"],
      ])}

      ${trabCard("🤝", "FGTS e INSS", "badge-purple", [
        ["Depósito FGTS", "8% do salário bruto/mês"],
        ["Aprendiz — FGTS", "2% do salário"],
        ["INSS Empregado (até R$1.518)", "7,5%"],
        ["INSS Empregado (até R$2.594)", "9%"],
        ["INSS Empregado (até R$3.856)", "12%"],
        ["INSS Empregado (até R$7.786)", "14%"],
        ["INSS Patronal", "20% sobre folha"],
        ["Prazo saque FGTS (demissão s/ justa)", "Após homologação"],
      ])}

      ${trabCard("⚖️", "Prazos Processuais", "badge-red", [
        [
          "Prazo para reclamar (trabalhador ativo)",
          "2 anos após cada lesão (prescrição parcial)",
        ],
        ["Prazo após rescisão", "2 anos a partir da extinção"],
        ["Prescrição total", "Até 5 anos durante o contrato"],
        ["Menor de 18 anos", "Prescrição não corre"],
        ["Contestação (Reclamação Trabalhista)", "5 dias úteis (audiência)"],
        ["Recurso Ordinário", "8 dias"],
        ["Embargos de Declaração", "5 dias"],
        ["Depósito recursal (2024)", "R$ 12.899,00 / R$ 25.798,00"],
      ])}

      ${trabCard("🚫", "Principais Causas de Ação", "badge-gray", [
        ["Horas extras não pagas", "Art. 58, 59 CLT"],
        ["FGTS não depositado", "Art. 29 da Lei 8.036/90"],
        ["Assédio moral", "Dano moral trabalhista"],
        ["Acidente de trabalho", "Responsabilidade objetiva"],
        ["Verbas rescisórias em atraso", "Multa do Art. 477 CLT"],
        ["Estabilidade gestante", "Art. 10 ADCT — até 5 meses após parto"],
        ["Estabilidade acidentado", "12 meses após alta médica"],
        ["Equiparação salarial", "Art. 461 CLT"],
      ])}

      ${trabCard("📅", "Datas e Obrigações", "badge-blue", [
        ["RAIS — entrega", "Janeiro/Fevereiro de cada ano"],
        ["e-Social", "Mensal"],
        ["DCTF", "Mensal — 15 do mês seguinte"],
        ["Comunicação de acidente (CAT)", "Imediatamente após ocorrência"],
        ["Exame admissional", "Antes de iniciar atividades"],
        ["Exame demissional", "Antes de assinar rescisão"],
        ["Renovação CTPS digital", "Contínua"],
        ["PPP — Perfil Profissiográfico", "Na rescisão do contrato"],
      ])}

    </div>
  `;
}

function trabCard(icon, title, badgeClass, rows) {
  return `
    <div class="card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <span style="font-size:1.5rem">${icon}</span>
        <h3 style="font-family:var(--font-display);font-size:1.1rem;font-weight:600">${title}</h3>
      </div>
      <div style="display:flex;flex-direction:column;gap:0">
        ${rows
          .map(
            ([label, value]) => `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="font-size:0.8rem;color:var(--text-muted);flex:1">${label}</span>
            <span style="font-size:0.8rem;font-weight:500;text-align:right;max-width:55%">${value}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>`;
}
