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

/* ── Agenda real do Supabase ───────────────────────────────── */
async function loadShopFilter() {
  const sel = document.getElementById('shopFilter');
  if (!sel || !window.supabase) {
    if (sel) sel.innerHTML = '<option value="">Todas as barbearias</option>';
    loadAgenda();
    return;
  }
  const { data: shops } = await window.supabase.from('shops').select('id, name').order('name');
  if (!shops || !shops.length) {
    sel.innerHTML = '<option value="">Nenhuma barbearia cadastrada</option>';
    loadAgenda();
    return;
  }
  sel.innerHTML = '<option value="">Todas as barbearias</option>' +
    shops.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  loadAgenda();
}

async function loadAgenda() {
  const el  = document.getElementById('agendaList');
  const sel = document.getElementById('shopFilter');
  if (!el) return;

  el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⏳</div><p>Carregando...</p></div>';

  if (!window.supabase) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⚠️</div><p>Supabase não conectado.</p></div>';
    return;
  }

  let query = window.supabase
    .from('appointments')
    .select('*, profiles(name)')
    .eq('status', 'confirmed')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: true });

  const shopId = sel ? sel.value : '';
  if (shopId) query = query.eq('shop_id', shopId);

  const { data: appts } = await query.limit(50);
  const list = appts || [];

  // Stats
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' });
  const hojeAppts = list.filter(a => a.appointment_date === hoje);
  const fatHoje   = hojeAppts.reduce((s, a) => s + (a.price || 0), 0);
  set('statHoje',  hojeAppts.length);
  set('statFat',   'R$ ' + fatHoje.toFixed(0));
  set('statTotal', list.length);

  const shopName = sel && sel.value ? (sel.options[sel.selectedIndex]?.text || '') : 'Todas as barbearias';
  set('agendaTitle', 'Agenda — ' + shopName);

  if (!list.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📅</div><p>Nenhum agendamento encontrado.</p></div>';
    return;
  }

  el.innerHTML = list.map(a => {
    const cliente = a.profiles?.name || 'Cliente';
    const status  = a.status === 'confirmed' ? '⏳ Aguardando' : a.status === 'completed' ? '✓ Concluído' : '✕ Cancelado';
    const cls     = a.status === 'completed' ? ' schedule-event--green' : a.status === 'cancelled' ? ' schedule-event--red' : '';
    return `<div class="sched-row">
      <div class="sched-time">${a.appointment_time || '—'}</div>
      <div class="schedule-event${cls}">
        <div class="schedule-event__client">${cliente} <span style="opacity:.8;font-size:var(--text-xs)">${status}</span></div>
        <div class="schedule-event__service">${a.service} · ${a.shop_name} · R$ ${a.price || 0}</div>
        <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:4px">${a.appointment_date || ''}</div>
        ${a.status === 'confirmed' ? `<div style="margin-top:var(--space-2);display:flex;gap:var(--space-2)">
          <button class="btn btn--sm" style="background:var(--color-green);color:#fff;padding:4px 10px;font-size:11px" onclick="updateAppt(${a.id},'completed')">✓ Concluir</button>
          <button class="btn btn--sm btn--ghost" style="font-size:11px" onclick="updateAppt(${a.id},'cancelled')">✕ Cancelar</button>
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}

async function updateAppt(id, status) {
  if (!window.supabase) return;
  await window.supabase.from('appointments').update({ status }).eq('id', id);
  toast(status === 'completed' ? 'Agendamento concluído ✓' : 'Agendamento cancelado', status === 'completed' ? 'success' : 'info');
  loadAgenda();
}

/* ── Inicialização ─────────────────────────────────────────── */
window.addEventListener('resize', updateSidebarBtn);
document.addEventListener('DOMContentLoaded', () => {
  updateSidebarBtn();
  updateDate();
  loadShopFilter();
});

