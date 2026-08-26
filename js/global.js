/* ============================================================
   BarberKut — global.js
   Código compartilhado por todas as páginas:
   toast, menu mobile, modais, utilitários de DOM
   ============================================================ */

/* ── Toast (notificação flutuante) ─────────────────────────── */
function toast(msg, type = 'info') {
  const container = document.getElementById('tc');
  if (!container) return;

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const t = document.createElement('div');
  t.className = 'toast' + (type !== 'info' ? ' toast--' + type : '');
  t.textContent = (icons[type] || 'ℹ') + ' ' + msg;

  container.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; }, 2600);
  setTimeout(() => t.remove(), 3100);
}

/* ── Menu mobile (hambúrguer) ──────────────────────────────── */
function toggleNav() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hbg');
  if (!menu || !hamburger) return;
  menu.classList.toggle('open');
  hamburger.classList.toggle('open');
}

/* ── Modais ────────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

/* ── Mostrar/ocultar senha ─────────────────────────────────── */
function togglePwd(id) {
  const field = document.getElementById(id);
  if (!field) return;
  field.type = field.type === 'password' ? 'text' : 'password';
}

/* ── Helpers de DOM ────────────────────────────────────────── */
function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function enable(id) {
  const el = document.getElementById(id);
  if (el) el.disabled = false;
}

/* ── Tema escuro/claro ─────────────────────────────────────── */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bk-theme', next);
  _updateThemeIcon();
}

function _updateThemeIcon() {
  const btn  = document.getElementById('themeToggle');
  if (!btn) return;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.setAttribute('aria-label', dark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
  btn.querySelector('.theme-toggle__icon').textContent = dark ? '☀️' : '🌙';
}

(function _initTheme() {
  const saved = localStorage.getItem('bk-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', _updateThemeIcon);
})();

/* ── Conta / sessão (Supabase Auth + localStorage como cache) ──
   bk-user = { id, name, email, phone, initials, photo, since }
   O localStorage guarda o perfil para leitura síncrona no nav.
   A sessão real é gerenciada pelo Supabase (token em localStorage). */
function bkUser() {
  try { return JSON.parse(localStorage.getItem('bk-user') || 'null'); }
  catch { return null; }
}
function bkSaveUser(user) { localStorage.setItem('bk-user', JSON.stringify(user)); }
function bkLogout() {
  if (window.supabase) window.supabase.auth.signOut();
  localStorage.removeItem('bk-user');
  location.href = 'index.html';
}

/* Sincroniza o perfil local com o Supabase na volta ao site */
(function _syncSession() {
  if (!window.supabase) return;
  window.supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('bk-user');
      if (window.location.pathname.includes('perfil')) location.href = 'index.html';
    }
    if (event === 'SIGNED_IN' && session) {
      const cached = bkUser();
      if (!cached || cached.id !== session.user.id) {
        window.supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (!data) return;
            const user = {
              id:       session.user.id,
              name:     data.name,
              email:    session.user.email,
              phone:    data.phone || '',
              photo:    data.photo_url || null,
              initials: bkInitials(data.name),
              since:    new Date(session.user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
            };
            bkSaveUser(user);
            _syncNav();
          });
      }
    }
  });
})();
function bkInitials(name) {
  return (name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
}

/* Atualiza o nav de QUALQUER página conforme o login (avatar vs. "Entrar") */
function _syncNav() {
  const actions = document.querySelector('.nav__actions');
  if (!actions) return;
  const entrarBtn = actions.querySelector('.btn--ghost');
  const avatar    = actions.querySelector('.avatar');
  const user      = bkUser();

  if (user) {
    if (entrarBtn) entrarBtn.style.display = 'none';
    if (avatar) {
      avatar.style.display = '';
      avatar.style.cursor  = 'pointer';
      avatar.title = user.name;
      avatar.onclick = () => { location.href = 'perfil.html'; };
      if (user.photo) {
        avatar.textContent = '';
        avatar.style.backgroundImage    = `url(${user.photo})`;
        avatar.style.backgroundSize     = 'cover';
        avatar.style.backgroundPosition = 'center';
      } else {
        avatar.style.backgroundImage = '';
        avatar.textContent = user.initials || bkInitials(user.name);
      }
    }
  } else {
    if (entrarBtn) { entrarBtn.style.display = ''; entrarBtn.onclick = () => { location.href = 'entrar.html'; }; }
    if (avatar) avatar.style.display = 'none';
  }
}
document.addEventListener('DOMContentLoaded', _syncNav);

/* ── Listeners globais ─────────────────────────────────────── */
document.addEventListener('click', (e) => {
  // Fecha o menu mobile ao clicar fora dele
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hbg');
  if (menu && hamburger && !e.target.closest('.nav') && !e.target.closest('#mobileMenu')) {
    menu.classList.remove('open');
    hamburger.classList.remove('open');
  }
  // Fecha modal ao clicar no overlay (fundo escuro)
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

