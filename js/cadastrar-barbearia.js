/* ============================================================
   BarberKut — cadastrar-barbearia.js
   Wizard de onboarding do parceiro. Monta um objeto no mesmo
   schema de data.js e salva em bk-my-shops (localStorage).
   getShopById() já lê de lá, então a barbearia aparece na vitrine.
   Carregar: data.js → global.js → cadastrar-barbearia.js
   ============================================================ */

const WDAYS = [
  ['seg', 'Segunda'], ['ter', 'Terça'], ['qua', 'Quarta'], ['qui', 'Quinta'],
  ['sex', 'Sexta'], ['sab', 'Sábado'], ['dom', 'Domingo']
];
const HOUR_DEFAULTS = {
  seg: ['09:00', '19:00'], ter: ['09:00', '19:00'], qua: ['09:00', '19:00'],
  qui: ['09:00', '19:00'], sex: ['09:00', '19:00'], sab: ['08:00', '17:00'], dom: null
};

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderHours();
  renderAmenities();
});

/* ── Navegação entre passos ────────────────────────────────── */
function goWizard(n) {
  document.getElementById('wsuccess').classList.remove('active');
  for (let i = 1; i <= 4; i++) {
    document.getElementById('wstep' + i).classList.toggle('active', i === n);
    const tab = document.getElementById('ws' + i);
    tab.classList.remove('active', 'completed');
    if (i < n)  tab.classList.add('completed');
    if (i === n) tab.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(from) {
  if (from === 1 && !val('fName')) { toast('Informe o nome da barbearia.', 'error'); return; }
  if (from === 2 && (!val('fStreet') || !val('fDistrict'))) { toast('Preencha rua e bairro.', 'error'); return; }
  if (from === 3) {
    if (!collectServices().length) { toast('Adicione ao menos um serviço.', 'error'); return; }
    renderReview();
  }
  goWizard(from + 1);
}

/* ── Serviços (linhas dinâmicas) ───────────────────────────── */
function renderServices() {
  document.getElementById('svcRows').innerHTML = '';
  addService('Corte', 35, 30);
}
function addService(name = '', price = '', dur = '') {
  const wrap = document.getElementById('svcRows');
  const div = document.createElement('div');
  div.className = 'svc-row';
  div.innerHTML =
    `<input class="form-control" type="text"   placeholder="Nome do serviço" value="${name}" />
     <input class="form-control" type="number" placeholder="Preço R$" value="${price}" min="0" />
     <input class="form-control" type="number" placeholder="Min" value="${dur}" min="5" step="5" />
     <button class="btn-icon btn-icon--sm" onclick="this.parentElement.remove()" type="button" aria-label="Remover">🗑</button>`;
  wrap.appendChild(div);
}
function collectServices() {
  const out = [];
  document.querySelectorAll('#svcRows .svc-row').forEach(r => {
    const [n, p, d] = r.querySelectorAll('input');
    if (n.value.trim()) out.push({ name: n.value.trim(), price: parseInt(p.value) || 0, duration: parseInt(d.value) || 30 });
  });
  return out;
}

/* ── Horários ──────────────────────────────────────────────── */
function renderHours() {
  document.getElementById('hoursGrid').innerHTML = WDAYS.map(([key, label]) => {
    const def = HOUR_DEFAULTS[key];
    const open = !!def;
    return `<div class="hour-row${open ? '' : ' closed'}" id="hr-${key}">
      <span class="hour-row__day">${label}</span>
      <label class="hour-row__toggle"><input type="checkbox" ${open ? 'checked' : ''} onchange="toggleDay('${key}',this.checked)" /> aberto</label>
      <div class="hour-row__times">
        <input class="form-control" type="time" id="ho-${key}" value="${def ? def[0] : '09:00'}" />
        <span>até</span>
        <input class="form-control" type="time" id="hc-${key}" value="${def ? def[1] : '18:00'}" />
      </div>
    </div>`;
  }).join('');
}
function toggleDay(key, isOpen) {
  document.getElementById('hr-' + key).classList.toggle('closed', !isOpen);
}
function collectHours() {
  const h = {};
  WDAYS.forEach(([key]) => {
    const row = document.getElementById('hr-' + key);
    h[key] = row.classList.contains('closed')
      ? null
      : [document.getElementById('ho-' + key).value, document.getElementById('hc-' + key).value];
  });
  return h;
}

/* ── Comodidades (vindas do catálogo de data.js) ───────────── */
function renderAmenities() {
  const A = window.AMENITIES || {};
  document.getElementById('amenGrid').innerHTML = Object.keys(A).map(key =>
    `<label class="amen-check"><input type="checkbox" value="${key}" /> <span>${A[key].icon} ${A[key].label}</span></label>`
  ).join('');
}
function collectAmenities() {
  return [...document.querySelectorAll('#amenGrid input:checked')].map(c => c.value);
}

/* ── Revisão ───────────────────────────────────────────────── */
function renderReview() {
  const services = collectServices();
  const amen  = collectAmenities();
  const hours = collectHours();
  const openDays = WDAYS.filter(([k]) => hours[k]).length;
  const minPrice = services.length ? Math.min(...services.map(s => s.price)) : 0;

  const rows = [
    ['Nome', val('fName')],
    ['Slogan', val('fTagline') || '—'],
    ['Telefone', val('fPhone') || '—'],
    ['Endereço', `${val('fStreet')}, ${val('fDistrict')} · ${val('fCity')}/${val('fState')}`],
    ['Serviços', services.map(s => s.name).join(', ') || '—'],
    ['A partir de', 'R$ ' + minPrice],
    ['Comodidades', amen.length ? amen.map(k => window.AMENITIES[k].label).join(', ') : '—'],
    ['Funcionamento', openDays + ' dias por semana']
  ];
  document.getElementById('reviewBlock').innerHTML = rows.map(([l, v]) =>
    `<div class="review-item"><span class="review-item__label">${l}</span><span class="review-item__value">${v}</span></div>`
  ).join('');
}

/* ── Conclusão: monta o objeto e salva ─────────────────────── */
function submitShop() {
  const services = collectServices();
  if (!services.length) { toast('Adicione ao menos um serviço.', 'error'); return; }

  const name   = val('fName');
  const covers = ['bc-g1', 'bc-g2', 'bc-g3', 'bc-g4', 'bc-g5', 'bc-g6'];
  const id     = _slug(name) + '-' + Math.random().toString(36).slice(2, 6);

  const shop = {
    id, slug: _slug(name), name,
    tagline: val('fTagline') || 'Nova barbearia na BarberKut.',
    cover: covers[Math.floor(Math.random() * covers.length)],
    icon: val('fIcon') || '✂',
    rating: 5.0, reviews_count: 0,
    price_from: Math.min(...services.map(s => s.price)),
    established: new Date().getFullYear(), is_open: true, verified: false,
    phone: val('fPhone'), instagram: val('fInsta').replace('@', ''),
    address: {
      street: val('fStreet'), district: val('fDistrict'),
      city: val('fCity') || 'Timbó', state: (val('fState') || 'SC').toUpperCase(),
      lat: -26.823 + (Math.random() - 0.5) * 0.02,
      lng: -49.271 + (Math.random() - 0.5) * 0.02,
      distance_km: +(Math.random() * 3 + 0.2).toFixed(1)
    },
    hours: collectHours(),
    amenities: collectAmenities(),
    about: val('fAbout') || val('fTagline') || 'Barbearia recém-cadastrada na BarberKut.',
    rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    gallery: [],
    services,
    barbers: [{ name: 'Responsável', role: 'Proprietário', initials: bkInitials(name), rating: 5.0, specialty: 'Atendimento geral' }],
    reviews: []
  };

  const mine = JSON.parse(localStorage.getItem('bk-my-shops') || '[]');
  mine.push(shop);
  localStorage.setItem('bk-my-shops', JSON.stringify(mine));

  // Tela de sucesso
  document.getElementById('successName').textContent = name;
  document.getElementById('successView').href = 'barbearia.html?id=' + id;
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('wsuccess').classList.add('active');
  document.querySelectorAll('#wstepper .stepper__step').forEach(t => { t.classList.remove('active'); t.classList.add('completed'); });
  toast('Barbearia cadastrada com sucesso! 🎉', 'success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Helpers ───────────────────────────────────────────────── */
function val(id) { return document.getElementById(id).value.trim(); }
function _slug(s) {
  return s.toLowerCase().replace(/[áàâãä]/g, 'a').replace(/[éêè]/g, 'e').replace(/[íì]/g, 'i')
    .replace(/[óôõ]/g, 'o').replace(/[úü]/g, 'u').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'barbearia';
}
function fmtPhone(input) {
  let d = input.value.replace(/\D/g, '').slice(0, 11);
  if (d.length > 6)      input.value = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  else if (d.length > 2) input.value = `(${d.slice(0,2)}) ${d.slice(2)}`;
  else if (d.length > 0) input.value = `(${d}`;
  else input.value = '';
}
