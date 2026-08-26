/* ============================================================
   BarberKut — barbearia.js
   Renderiza a vitrine de UMA barbearia a partir de ?id= na URL.
   Lê os dados de data.js (window.SHOPS). Carregar nesta ordem:
     data.js → global.js → barbearia.js
   ============================================================ */

/* Mapeia Date.getDay() (0=domingo) para as chaves de hours{} */
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const WEEKDAY_LABELS = {
  seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta',
  sex: 'Sexta', sab: 'Sábado', dom: 'Domingo'
};

let SHOP = null;   // barbearia atual

/* ── Inicialização ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  SHOP = (window.getShopById && getShopById(id)) || null;

  if (!SHOP) {
    document.getElementById('shopNotFound').style.display = 'block';
    document.getElementById('shopContent').style.display = 'none';
    document.getElementById('bookingBar').style.display = 'none';
    return;
  }

  document.title = `${SHOP.name} — BarberKut`;
  renderHero();
  renderStats();
  renderGallery();
  renderAbout();
  renderServices();
  renderBarbers();
  renderHours();
  renderReviews();
  renderBookingBar();
  initShopMap();
  refreshFavBtn();
});

/* ── Utilidades ────────────────────────────────────────────── */

/* Calcula se está aberto AGORA com base no relógio + horários */
function computeOpen(shop) {
  const now = new Date();
  const today = shop.hours[WEEKDAYS[now.getDay()]];
  if (!today) return { open: false, today: null };
  const [oh, om] = today[0].split(':').map(Number);
  const [ch, cm] = today[1].split(':').map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  return { open: mins >= oh * 60 + om && mins < ch * 60 + cm, today };
}

/* Estrelas visuais a partir de uma nota (0–5) */
function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) s += '<span class="star star--on">★</span>';
    else if (i === full && half) s += '<span class="star star--half">★</span>';
    else s += '<span class="star">★</span>';
  }
  return s;
}

/* "2026-06-10" → "há 6 dias" (relativo à data atual) */
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff <= 0) return 'hoje';
  if (diff === 1) return 'ontem';
  if (diff < 7) return `há ${diff} dias`;
  if (diff < 30) { const w = Math.floor(diff / 7); return `há ${w} ${w === 1 ? 'semana' : 'semanas'}`; }
  const m = Math.floor(diff / 30);
  return `há ${m} ${m === 1 ? 'mês' : 'meses'}`;
}

function money(v) { return 'R$ ' + v.toFixed(0); }

/* ── Seções ────────────────────────────────────────────────── */

function renderHero() {
  const s = SHOP;
  const { open } = computeOpen(s);

  document.getElementById('shopCover').className = 'shop-hero__cover ' + s.cover;
  document.getElementById('shopLogo').textContent = s.icon;
  document.getElementById('shopName').textContent = s.name;
  document.getElementById('shopTagline').textContent = s.tagline;

  const badges = [];
  badges.push(open
    ? '<span class="badge badge--green">● Aberto agora</span>'
    : `<span class="badge badge--yellow">● Fechado${s.opens_at ? ' · abre ' + s.opens_at : ''}</span>`);
  if (s.verified) badges.push('<span class="badge badge--navy">✓ Verificada</span>');
  document.getElementById('shopBadges').innerHTML = badges.join('');

  document.getElementById('shopRating').innerHTML =
    `<span class="shop-hero__stars">${stars(s.rating)}</span>
     <strong>${s.rating.toFixed(1)}</strong>
     <span class="shop-hero__muted">(${s.reviews_count} avaliações)</span>`;

  document.getElementById('shopAddress').innerHTML =
    `<i>📍</i> ${s.address.street} · ${s.address.district} · ${s.address.distance_km} km de você`;
}

function renderStats() {
  const s = SHOP;
  const anos = new Date().getFullYear() - s.established;
  const items = [
    { v: s.rating.toFixed(1),        l: 'Avaliação' },
    { v: s.reviews_count,            l: 'Avaliações' },
    { v: (s.barbers || []).length,   l: 'Profissionais' },
    { v: anos < 1 ? 'Nova' : anos + (anos === 1 ? ' ano' : ' anos'), l: 'No mercado' }
  ];
  document.getElementById('shopStats').innerHTML = items.map(i =>
    `<div class="shop-stat"><div class="shop-stat__value">${i.v}</div>
     <div class="shop-stat__label">${i.l}</div></div>`
  ).join('');
}

function renderGallery() {
  const g = SHOP.gallery || [];
  const el = document.getElementById('gallery');
  if (!g.length) { el.closest('.shop-section').style.display = 'none'; return; }
  el.innerHTML = g.map(item =>
    `<div class="gallery-item ${item.grad}"><span>${item.icon}</span></div>`
  ).join('');
}

function renderAbout() {
  document.getElementById('aboutText').textContent = SHOP.about;
  document.getElementById('amenities').innerHTML = SHOP.amenities.map(key => {
    const a = window.AMENITIES[key];
    if (!a) return '';
    return `<div class="amenity"><span class="amenity__icon">${a.icon}</span>${a.label}</div>`;
  }).join('');
}

function renderServices() {
  document.getElementById('services').innerHTML = SHOP.services.map(sv => `
    <div class="service-row">
      <div class="service-row__info">
        <div class="service-row__name">
          ${sv.name}${sv.popular ? '<span class="service-row__tag">Popular</span>' : ''}
        </div>
        <div class="service-row__desc">${sv.desc}</div>
        <div class="service-row__time">🕐 ${sv.duration} min</div>
      </div>
      <div class="service-row__action">
        <div class="service-row__price">${money(sv.price)}</div>
        <button class="btn btn--primary btn--sm" onclick="bookService('${sv.name.replace(/'/g, '')}')">Agendar</button>
      </div>
    </div>`
  ).join('');
}

function renderBarbers() {
  const team = SHOP.barbers || [];
  const el = document.getElementById('barbers');
  if (!team.length) { el.closest('.shop-section').style.display = 'none'; return; }
  el.innerHTML = team.map(b => `
    <div class="team-card">
      <div class="team-card__avatar">${b.initials}</div>
      <div class="team-card__name">${b.name}</div>
      <div class="team-card__role">${b.role}</div>
      <div class="team-card__specialty">${b.specialty}</div>
      <div class="team-card__rating">★ ${b.rating.toFixed(1)}</div>
    </div>`
  ).join('');
}

function renderHours() {
  const s = SHOP;
  const { open, today } = computeOpen(s);
  const todayKey = WEEKDAYS[new Date().getDay()];

  document.getElementById('openStatus').innerHTML = open
    ? `<span class="open-dot open-dot--on"></span> Aberto agora${today ? ' · fecha às ' + today[1] : ''}`
    : `<span class="open-dot"></span> Fechado agora${s.opens_at ? ' · abre às ' + s.opens_at : ''}`;

  const order = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  document.getElementById('hoursTable').innerHTML = order.map(key => {
    const h = s.hours[key];
    const isToday = key === todayKey;
    return `<div class="hours-row${isToday ? ' hours-row--today' : ''}">
      <span class="hours-row__day">${WEEKDAY_LABELS[key]}${isToday ? ' <em>· hoje</em>' : ''}</span>
      <span class="hours-row__time">${h ? h[0] + ' – ' + h[1] : 'Fechado'}</span>
    </div>`;
  }).join('');
}

function renderReviews() {
  const s = SHOP;
  if (!(s.reviews || []).length) {
    document.getElementById('reviewSummary').style.display = 'none';
    document.getElementById('reviewList').innerHTML =
      `<p style="grid-column:1/-1;text-align:center;color:var(--color-text-muted);padding:var(--space-8)">✨ Barbearia nova! Ainda não há avaliações — seja o primeiro após o seu corte.</p>`;
    return;
  }
  const total = s.reviews_count;
  const bars = [5, 4, 3, 2, 1].map(n => {
    const count = s.rating_breakdown[n] || 0;
    const pct = total ? Math.round((count / total) * 100) : 0;
    return `<div class="rb-row">
      <span class="rb-row__label">${n} ★</span>
      <div class="rb-row__track"><div class="rb-row__fill" style="width:${pct}%"></div></div>
      <span class="rb-row__pct">${pct}%</span>
    </div>`;
  }).join('');

  document.getElementById('reviewSummary').innerHTML = `
    <div class="rev-score">
      <div class="rev-score__num">${s.rating.toFixed(1)}</div>
      <div class="shop-hero__stars">${stars(s.rating)}</div>
      <div class="rev-score__count">${total} avaliações</div>
    </div>
    <div class="rev-bars">${bars}</div>`;

  document.getElementById('reviewList').innerHTML = s.reviews.map(r => `
    <div class="review-card">
      <div class="review-card__head">
        <div class="review-card__avatar">${r.initials}</div>
        <div>
          <div class="review-card__author">${r.author}</div>
          <div class="review-card__meta">${r.service} · ${timeAgo(r.date)}</div>
        </div>
        <div class="review-card__stars">${stars(r.rating)}</div>
      </div>
      <p class="review-card__text">${r.text}</p>
    </div>`
  ).join('');
}

function renderBookingBar() {
  document.getElementById('barName').textContent = SHOP.name;
  document.getElementById('barPrice').innerHTML = `A partir de <strong>${money(SHOP.price_from)}</strong>`;
}

/* ── Mapa (Leaflet) ────────────────────────────────────────── */
function initShopMap() {
  const el = document.getElementById('shopMap');
  if (!el || typeof L === 'undefined') return;
  const { lat, lng } = SHOP.address;

  const map = L.map('shopMap', { scrollWheelZoom: false }).setView([lat, lng], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 19
  }).addTo(map);

  L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'barberkut-marker',
      html: `<div style="background:#E5383B;width:34px;height:34px;border-radius:50% 50% 50% 0;
               transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.4);
               display:flex;align-items:center;justify-content:center;border:2px solid #fff">
               <span style="transform:rotate(45deg);font-size:16px">${SHOP.icon}</span></div>`,
      iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -34]
    })
  }).addTo(map).bindPopup(`<strong>${SHOP.name}</strong><br>${SHOP.address.street}`);
}

/* ── Ações ─────────────────────────────────────────────────── */

/* Agendar: leva o contexto da barbearia (e do serviço) ao booking */
function bookNow() {
  location.href = `booking.html?shop=${SHOP.id}`;
}
function bookService(name) {
  location.href = `booking.html?shop=${SHOP.id}&service=${encodeURIComponent(name)}`;
}

/* Favoritar — já funciona client-side via localStorage */
function getFavs() {
  try { return JSON.parse(localStorage.getItem('bk-favs') || '[]'); }
  catch { return []; }
}
function toggleFav() {
  const favs = getFavs();
  const i = favs.indexOf(SHOP.id);
  if (i >= 0) { favs.splice(i, 1); toast('Removido dos favoritos', 'info'); }
  else { favs.push(SHOP.id); toast('Adicionado aos favoritos ❤', 'success'); }
  localStorage.setItem('bk-favs', JSON.stringify(favs));
  refreshFavBtn();
}
function refreshFavBtn() {
  const btn = document.getElementById('favBtn');
  if (!btn) return;
  const fav = getFavs().includes(SHOP.id);
  btn.classList.toggle('is-fav', fav);
  btn.innerHTML = fav ? '❤ Favoritada' : '🤍 Favoritar';
}

/* Compartilhar — usa a API nativa quando disponível */
function shareShop() {
  const url = location.href;
  if (navigator.share) {
    navigator.share({ title: SHOP.name, text: `Confira ${SHOP.name} na BarberKut`, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
    toast('Link copiado para a área de transferência', 'success');
  }
}

/* Como chegar — abre o Google Maps na localização */
function openDirections() {
  const { lat, lng } = SHOP.address;
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}
