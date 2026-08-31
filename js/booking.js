/* ============================================================
   BarberKut — booking.js
   Fluxo de agendamento:
   Tela 0 (como agendar?) → Barbeiro → Data & Hora → Pagamento
   ============================================================ */

/* ── Estado do agendamento ─────────────────────────────────── */
const B = {
  svc:    null,
  price:  0,
  dur:    0,
  barber: null,
  date:   null,
  time:   null
};

/* ── Estado do calendário ──────────────────────────────────── */
const cal = {
  y: new Date().getFullYear(),
  m: new Date().getMonth()
};

/* ── Params da URL ─────────────────────────────────────────── */
const _params      = new URLSearchParams(window.location.search);
const _fromSim     = _params.get('from') === 'sim';
const _simCorte    = _params.get('corte') || 'Corte simulado';
const _shopId      = _params.get('shop');           // vem da vitrine
const _serviceName = _params.get('service');        // serviço escolhido na vitrine
let   SHOP_CTX     = null;                           // barbearia de origem

/* Gradientes e ícones para gerar avatares/pills dinâmicos */
const _BRB_GRADS = [
  'linear-gradient(135deg,#1A3A6B,#0B1F3A)',
  'linear-gradient(135deg,#C81D4E,#E5383B)',
  'linear-gradient(135deg,#4B2D8A,#2D1B69)',
  'linear-gradient(135deg,#0D6E56,#1A7F37)'
];
const _SVC_ICONS = ['✂', '💈', '🪒', '🧔'];

/* Aplica o contexto da barbearia (nome, barbeiros, serviços) à página */
function _applyShopContext() {
  if (!_shopId || typeof getShopById !== 'function') return;
  SHOP_CTX = getShopById(_shopId);
  if (!SHOP_CTX) return;

  const a = SHOP_CTX.address;
  const loc = `${SHOP_CTX.name} · ${a.district}, ${a.city} ${a.state}`;
  set('bookingShopTag', '✂ ' + loc);
  set('flowShopName', loc);
  set('barberStepSub', 'Todos disponíveis para hoje na ' + SHOP_CTX.name);
  _renderBarbers(SHOP_CTX);
  _renderExpressPills(SHOP_CTX);
}

/* Renderiza os barbeiros REAIS da barbearia no Step 1 */
function _renderBarbers(shop) {
  const list = document.getElementById('barberList');
  if (!list) return;
  list.innerHTML = shop.barbers.map((b, i) => `
    <div class="barber-card" onclick="pickBrb(this,'${b.name.replace(/'/g, '')}')">
      <div class="avatar avatar--lg" style="background:${_BRB_GRADS[i % _BRB_GRADS.length]}">${b.initials}</div>
      <div class="barber-card__info">
        <div class="barber-card__name">${b.name}</div>
        <div style="font-size:var(--text-xs);color:var(--color-yellow);font-weight:600;margin-bottom:var(--space-1)">★ ${b.rating.toFixed(1)}</div>
        <div style="font-size:var(--text-xs);color:var(--color-text-muted)">${b.specialty} · ${b.role}</div>
      </div>
      <div class="barber-card__avail">
        <span class="avail-dot avail-dot--green"></span>
        <span style="color:var(--color-green)">Disponível</span>
      </div>
    </div>`
  ).join('');
}

/* Renderiza os serviços REAIS da barbearia como pills no Express */
function _renderExpressPills(shop) {
  const wrap = document.getElementById('expressPills');
  if (!wrap) return;
  wrap.innerHTML = shop.services.slice(0, 3).map((sv, i) => `
    <label class="cut-pill">
      <input type="radio" name="expCut" value="${sv.name.replace(/\|/g, '')}|${sv.price}|${sv.duration}" onchange="updateExpress()"/>
      <span class="cut-pill__dot"></span>
      <span class="cut-pill__icon">${_SVC_ICONS[i % _SVC_ICONS.length]}</span>
      <span class="cut-pill__name">${sv.name}</span>
      <span class="cut-pill__price">R$ ${sv.price}</span>
    </label>`
  ).join('');
}

/* ════════════════════════════════════════════════════════════
   TELA 0 — Express
   ════════════════════════════════════════════════════════════ */

function updateExpress() {
  const radio = document.querySelector('input[name="expCut"]:checked');
  document.getElementById('btnExpress').disabled = !radio;
}

function confirmarExpress() {
  const radio = document.querySelector('input[name="expCut"]:checked');
  if (!radio) return;
  const [nome, priceStr, durStr] = radio.value.split('|');
  const addBarba = document.getElementById('expBarba').checked;
  const price    = parseInt(priceStr) + (addBarba ? 20 : 0);
  const dur      = parseInt(durStr)   + (addBarba ? 20 : 0);
  const svcNome  = addBarba ? nome + ' + Barba' : nome;
  _setService(svcNome, price, dur);
  _enterFlow();
}

/* ════════════════════════════════════════════════════════════
   STEP 1 — Barbeiro
   ════════════════════════════════════════════════════════════ */

function pickBrb(el, nome) {
  document.querySelectorAll('.barber-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  B.barber = nome;
  set('rBrb', nome);
  enable('btn1');
}

/* ════════════════════════════════════════════════════════════
   STEP 2 — Data e Hora
   ════════════════════════════════════════════════════════════ */

function pickT(el, horario) {
  document.querySelectorAll('.time-slot:not(.busy)').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  B.time = horario;
  set('rTime', horario);
  enable('btn2');
}

function renderCal() {
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const days   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const today  = new Date();

  set('calTitle', months[cal.m] + ' ' + cal.y);

  let html = days.map(d => `<div class="booking-calendar__day-name">${d}</div>`).join('');

  const firstWeekday = new Date(cal.y, cal.m, 1).getDay();
  for (let i = 0; i < firstWeekday; i++) html += '<div></div>';

  const totalDays = new Date(cal.y, cal.m + 1, 0).getDate();
  for (let d = 1; d <= totalDays; d++) {
    const dt    = new Date(cal.y, cal.m, d);
    const isToday = dt.toDateString() === today.toDateString();
    const isPast  = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let cls = 'booking-calendar__day';
    if (isPast)  cls += ' disabled';
    if (isToday) cls += ' today';
    if (!isPast && dt.getDay() !== 0) cls += ' has-slots';
    html += `<div class="${cls}" onclick="pickDay(this,${d})">${d}</div>`;
  }

  document.getElementById('calGrid').innerHTML = html;
}

function mMove(dir) {
  cal.m += dir;
  if (cal.m > 11) { cal.m = 0;  cal.y++; }
  if (cal.m < 0)  { cal.m = 11; cal.y--; }
  renderCal();
}

function pickDay(el, dia) {
  if (el.classList.contains('disabled')) return;
  document.querySelectorAll('.booking-calendar__day').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  const dt = new Date(cal.y, cal.m, dia);
  B.date = dt.toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' });
  set('rDate', B.date);
  document.getElementById('timeSection').style.display = 'block';
}

/* ════════════════════════════════════════════════════════════
   STEP 3 — Pagamento
   ════════════════════════════════════════════════════════════ */

let _payMethod = null;

function toggleCard(forma) {
  _payMethod = forma;
  document.getElementById('cardFields').style.display = (forma === 'pix' || forma === 'dinheiro') ? 'none' : 'block';
  document.getElementById('pixBlock').style.display   =  forma === 'pix' ? 'block' : 'none';
  document.getElementById('btnConfirm').disabled = false;
}

function fmtCard(input) {
  let digits = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = digits.replace(/(.{4})/g, '$1 ').trim();
}

async function confirmBooking() {
  if (!_payMethod) {
    toast('Selecione uma forma de pagamento para continuar.', 'error');
    return;
  }
  if (_payMethod === 'credito' || _payMethod === 'debito') {
    const num = document.getElementById('cardNum')?.value.replace(/\s/g, '') || '';
    const exp = document.getElementById('cardExp')?.value || '';
    const cvv = document.getElementById('cardCvv')?.value || '';
    if (num.length < 16 || !exp || cvv.length < 3) {
      toast('Preencha os dados do cartão corretamente.', 'error');
      return;
    }
  }
  const user = (typeof bkUser === 'function') ? bkUser() : null;
  const appt = {
    shop_id:          SHOP_CTX ? SHOP_CTX.id   : 'central',
    shop_name:        SHOP_CTX ? SHOP_CTX.name : 'Barbearia Central',
    service:          B.svc,
    price:            B.price,
    barber:           B.barber,
    appointment_date: B.date,
    appointment_time: B.time
  };

  if (user && window.supabase) {
    await window.supabase.from('appointments').insert({ ...appt, user_id: user.id });
  } else {
    try {
      const list = JSON.parse(localStorage.getItem('bk-appointments') || '[]');
      list.unshift({ shopId: appt.shop_id, shopName: appt.shop_name, service: appt.service,
        price: appt.price, barber: appt.barber, date: appt.appointment_date,
        time: appt.appointment_time, createdAt: Date.now() });
      localStorage.setItem('bk-appointments', JSON.stringify(list));
    } catch (_) {}
  }

  toast('✅ Agendamento confirmado! Você receberá a confirmação no WhatsApp.', 'success');
  const dest = user ? 'perfil.html' : 'index.html';
  setTimeout(() => window.location.href = dest, 2800);
}

/* ════════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ════════════════════════════════════════════════════════════ */

function goStep(n) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  document.getElementById('bs' + n).classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const tab = document.getElementById('st' + i);
    if (!tab) continue;
    tab.classList.remove('active', 'completed');
    if (i < n)  tab.classList.add('completed');
    if (i === n) tab.classList.add('active');
  }

  if (n === 2) renderCal();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarTela0() {
  document.getElementById('flowWrap').style.display = 'none';
  document.getElementById('tela0').style.display    = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Helpers internos ──────────────────────────────────────── */
function _setService(nome, price, dur) {
  Object.assign(B, { svc: nome, price, dur });
  set('rSvc',   nome);
  set('rDur',   dur + ' min');
  set('rTotal', 'R$ ' + price.toFixed(2).replace('.', ','));
}

function _enterFlow() {
  document.getElementById('tela0').style.display    = 'none';
  document.getElementById('flowWrap').style.display = 'block';
  // Banner da barbearia de origem (quando veio da vitrine, não do simulador)
  if (SHOP_CTX && !_fromSim) {
    const sb = document.getElementById('shopBanner');
    if (sb) { sb.style.display = 'flex'; set('shopBannerName', SHOP_CTX.name); }
  }
  goStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  _applyShopContext();   // aplica nome/barbeiros/serviços da barbearia (se houver)

  if (_fromSim) {
    // Vem do simulador: pula tela 0, entra direto no fluxo com o corte simulado
    _setService(_simCorte, 35, 30);
    _enterFlow();
    // Mostra o banner do corte simulado
    const banner = document.getElementById('simBanner');
    banner.style.display = 'flex';
    set('simBannerName', _simCorte);
    return;
  }

  if (SHOP_CTX && _serviceName) {
    // Vem de um serviço específico da vitrine: pula a tela 0
    const sv = SHOP_CTX.services.find(s => s.name === _serviceName);
    _setService(_serviceName, sv ? sv.price : SHOP_CTX.price_from, sv ? sv.duration : 30);
    _enterFlow();
  }
  // Se veio só com ?shop= (sem serviço), permanece na tela 0 já contextualizada.
});

