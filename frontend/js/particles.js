// ═══════════════════════════════════════
// LEXFLOW — FLOATING PARTICLES ANIMATION
// ═══════════════════════════════════════

function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const x = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 8 + Math.random() * 10;
    const size = 1 + Math.random() * 2.5;
    const opacity = 0.3 + Math.random() * 0.7;

    p.style.cssText = `
      left: ${x}%;
      bottom: ${Math.random() * 20}%;
      width: ${size}px;
      height: ${size}px;
      opacity: 0;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      background: ${Math.random() > 0.6 ? "var(--gold)" : "var(--accent)"};
    `;

    container.appendChild(p);
  }
}

document.addEventListener("DOMContentLoaded", initParticles);
