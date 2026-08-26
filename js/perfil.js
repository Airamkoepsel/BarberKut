/* ============================================================
   BarberKut — perfil.js
   Página "minha conta": dados, agendamentos e favoritos.
   Tudo via localStorage (mock) — pronto para virar Supabase.
     bk-user          → sessão / perfil
     bk-favs          → ids das barbearias favoritas (salvas na vitrine)
     bk-appointments  → agendamentos (salvos no fim do booking)
   Carregar: data.js → global.js → perfil.js
   ============================================================ */

let _editPhoto = undefined;   // undefined = inalterado · null = removida · string = nova

document.addEventListener('DOMContentLoaded', async () => {
  const u = bkUser();
  if (!u) { location.href = 'entrar.html'; return; }
  renderHeader(u);
  await renderAppointments();
  await renderFavorites();
  renderStats();
});

/* Agendamentos: Supabase se logado, fallback localStorage */
async function _appts() {
  const u = bkUser();
  if (u && window.supabase) {
    const { data } = await window.supabase
      .from('appointments').select('*')
      .eq('user_id', u.id).order('created_at', { ascending: false });
    return (data || []).map(a => ({
      id: a.id, shopId: a.shop_id, shopName: a.shop_name, service: a.service,
      price: a.price, barber: a.barber, date: a.appointment_date, time: a.appointment_time
    }));
  }
  try { return JSON.parse(localStorage.getItem('bk-appointments') || '[]'); } catch { return []; }
}

/* Favoritos: Supabase se logado, fallback localStorage */
async function _favs() {
  const u = bkUser();
  if (u && window.supabase) {
    const { data } = await window.supabase
      .from('favorites').select('shop_id').eq('user_id', u.id);
    return (data || []).map(f => f.shop_id);
  }
  try { return JSON.parse(localStorage.getItem('bk-favs') || '[]'); } catch { return []; }
}

/* ── Header ────────────────────────────────────────────────── */
function renderHeader(u) {
  const av = document.getElementById('pAvatar');
  if (u.photo) { av.textContent = ''; av.style.backgroundImage = `url(${u.photo})`; }
  else { av.style.backgroundImage = ''; av.textContent = u.initials || bkInitials(u.name); }

  document.getElementById('pName').textContent  = u.name;
  document.getElementById('pEmail').textContent = u.email;
  const meta = [];
  if (u.phone) meta.push('📞 ' + u.phone);
  if (u.since) meta.push('Membro desde ' + u.since);
  document.getElementById('pMeta').textContent = meta.join('   ·   ') || 'Bem-vindo à BarberKut';
}

/* ── Stats (usa cache preenchido pelos renders async) ────────── */
let _cachedAppts = [], _cachedFavs = [];
function renderStats() {
  const total = _cachedAppts.reduce((s, a) => s + (Number(a.price) || 0), 0);
  const items = [
    { v: _cachedAppts.length,      l: 'Agendamentos' },
    { v: _cachedFavs.length,       l: 'Favoritas' },
    { v: 'R$ ' + total.toFixed(0), l: 'Total agendado' }
  ];
  document.getElementById('pStats').innerHTML = items.map(i =>
    `<div class="pstat"><div class="pstat__value">${i.v}</div><div class="pstat__label">${i.l}</div></div>`
  ).join('');
}

/* ── Agendamentos ──────────────────────────────────────────── */
async function renderAppointments() {
  _cachedAppts = await _appts();
  const el = document.getElementById('apptList');
  if (!_cachedAppts.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-state__icon">📅</div>
      <p>Você ainda não tem agendamentos.</p>
      <a href="index.html#discoverySection" class="btn btn--primary">Encontrar barbearia</a>
    </div>`;
    return;
  }
  el.innerHTML = _cachedAppts.map((a, i) => `
    <div class="appt-card">
      <div class="appt-card__icon">✂</div>
      <div class="appt-card__info">
        <div class="appt-card__svc">${a.service}</div>
        <div class="appt-card__meta">${a.shopName}${a.barber ? ' · ' + a.barber : ''} · R$ ${Number(a.price).toFixed(0)}</div>
      </div>
      <div class="appt-card__when">
        <div class="appt-card__date">${a.date || '—'}</div>
        <div class="appt-card__time">${a.time || ''}</div>
      </div>
      <button class="btn-icon btn-icon--sm" onclick="cancelAppt(${i},'${a.id || ''}')" title="Cancelar" aria-label="Cancelar" style="margin-left:var(--space-2)">🗑</button>
    </div>`
  ).join('');
}

async function cancelAppt(idx, supabaseId) {
  const u = bkUser();
  if (u && window.supabase && supabaseId) {
    await window.supabase.from('appointments').delete().eq('id', supabaseId);
  } else {
    const list = JSON.parse(localStorage.getItem('bk-appointments') || '[]');
    list.splice(idx, 1);
    localStorage.setItem('bk-appointments', JSON.stringify(list));
  }
  toast('Agendamento cancelado', 'info');
  await renderAppointments();
  renderStats();
}

/* ── Favoritos ─────────────────────────────────────────────── */
async function renderFavorites() {
  _cachedFavs = await _favs();
  const el = document.getElementById('favList');
  if (!_cachedFavs.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-state__icon">❤</div>
      <p>Você ainda não favoritou nenhuma barbearia.</p>
      <a href="index.html#discoverySection" class="btn btn--primary">Explorar barbearias</a>
    </div>`;
    return;
  }
  const cards = _cachedFavs.map(id => {
    const s = (typeof getShopById === 'function') ? getShopById(id) : null;
    if (!s) return '';
    return `<div class="fav-card">
      <button class="fav-card__rm" onclick="removeFav('${s.id}')" title="Remover" aria-label="Remover">✕</button>
      <a href="barbearia.html?id=${s.id}" style="text-decoration:none;color:inherit">
        <div class="fav-card__cover ${s.cover}">${s.icon}</div>
        <div class="fav-card__body">
          <div class="fav-card__name">${s.name}</div>
          <div class="fav-card__meta">★ ${s.rating.toFixed(1)} · ${s.address.district} · a partir de R$ ${s.price_from}</div>
        </div>
      </a>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="fav-grid">${cards}</div>`;
}

async function removeFav(id) {
  const u = bkUser();
  if (u && window.supabase) {
    await window.supabase.from('favorites').delete().match({ user_id: u.id, shop_id: id });
  } else {
    const favs = (await _favs()).filter(x => x !== id);
    localStorage.setItem('bk-favs', JSON.stringify(favs));
  }
  toast('Removido dos favoritos', 'info');
  await renderFavorites();
  renderStats();
}

/* ── Editar perfil ─────────────────────────────────────────── */
function openEdit() {
  const u = bkUser();
  _editPhoto = undefined;
  document.getElementById('editName').value  = u.name  || '';
  document.getElementById('editEmail').value = u.email || '';
  document.getElementById('editPhone').value = u.phone || '';
  _applyPhotoPreview(u.photo);
  openModal('mEdit');
}

function _applyPhotoPreview(photo) {
  const p = document.getElementById('editPhotoPreview');
  if (photo) { p.textContent = ''; p.style.backgroundImage = `url(${photo})`; }
  else { p.style.backgroundImage = ''; p.textContent = bkInitials(document.getElementById('editName').value); }
}

/* Lê a foto, redimensiona p/ no máx. 256px e comprime (cabe no localStorage) */
function onPhotoPick(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const max = 256;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      _editPhoto = c.toDataURL('image/jpeg', 0.85);
      _applyPhotoPreview(_editPhoto);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(f);
}

function clearPhoto() { _editPhoto = null; _applyPhotoPreview(null); }

async function saveProfile() {
  const u = bkUser();
  u.name  = document.getElementById('editName').value.trim() || u.name;
  u.phone = document.getElementById('editPhone').value.trim();
  if (_editPhoto !== undefined) u.photo = _editPhoto;
  u.initials = bkInitials(u.name);
  bkSaveUser(u);
  if (u.id && window.supabase) {
    await window.supabase.from('profiles')
      .update({ name: u.name, phone: u.phone, photo_url: u.photo || null })
      .eq('id', u.id);
  }
  closeModal('mEdit');
  toast('Perfil atualizado ✓', 'success');
  renderHeader(u);
  renderStats();
  if (typeof _syncNav === 'function') _syncNav();   // atualiza o avatar do nav
}

/* Máscara de telefone */
function fmtPhone(input) {
  let d = input.value.replace(/\D/g, '').slice(0, 11);
  if (d.length > 6)      input.value = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  else if (d.length > 2) input.value = `(${d.slice(0,2)}) ${d.slice(2)}`;
  else if (d.length > 0) input.value = `(${d}`;
  else input.value = '';
}
