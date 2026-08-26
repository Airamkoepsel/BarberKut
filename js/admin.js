/* ============================================================
   BarberKut — admin.js
   Lógica do painel administrativo:
   navegação entre seções, sidebar mobile, gráfico de barras
   ============================================================ */

/* ── Títulos exibidos no topo de cada seção ────────────────── */
const TITLES = {
  agenda:     'Agenda do Dia',
  financeiro: 'Financeiro',
  clientes:   'Clientes',
  metricas:   'Métricas Premium',
  equipe:     'Gestão de Equipe',
  premium:    'BarberKut Premium',
  config:     'Configurações'
};

/* ── Troca de seção via sidebar ────────────────────────────── */
function show(sec, el) {
  // ativa só a seção clicada
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + sec).classList.add('active');

  // marca o item da sidebar como ativo
  document.querySelectorAll('.sidebar__item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  set('secTitle', TITLES[sec] || sec);

  // o gráfico só pode ser construído quando a seção está visível
  if (sec === 'financeiro') buildChart();

  closeSb();
}

/* ── Sidebar no mobile (abre/fecha com overlay) ────────────── */
function toggleSb() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function closeSb() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

/* ── Gráfico de barras do faturamento (7 dias) ─────────────── */
function buildChart() {
  const valores = [420, 385, 510, 290, 480, 350, 255];
  const labels  = ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom', 'Seg'];
  const max = Math.max(...valores);

  // barras proporcionais ao maior valor (160px de altura máxima)
  document.getElementById('bars').innerHTML = valores.map((v, i) => `
    <div class="bar-col">
      <div class="bar-val">R$${v}</div>
      <div class="bar" style="height:${Math.round((v / max) * 160)}px;${i === 6 ? 'background:var(--color-red);' : ''}"></div>
    </div>`).join('');

  // rótulos dos dias (o último — hoje — em negrito)
  document.getElementById('barLabels').innerHTML = labels.map((l, i) =>
    `<span class="bar-lbl" style="font-weight:${i === 6 ? 600 : 400}">${l}</span>`
  ).join('');
}

/* ── Data de hoje no subtítulo (gerada dinamicamente) ──────── */
function updateDate() {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  // primeira letra maiúscula: "terça-feira" → "Terça-feira"
  set('secSub', hoje.charAt(0).toUpperCase() + hoje.slice(1));
}

/* ── Botão hambúrguer: visível só em telas pequenas ────────── */
function updateSidebarBtn() {
  const btn = document.getElementById('sidebarBtn');
  if (btn) btn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
}

/* ── Inicialização ─────────────────────────────────────────── */
window.addEventListener('resize', updateSidebarBtn);
document.addEventListener('DOMContentLoaded', () => {
  updateSidebarBtn();
  updateDate();
});

