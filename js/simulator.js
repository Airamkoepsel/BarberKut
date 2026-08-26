/* ============================================================
   BarberKut — simulator.js
   Simulador de Corte com IA:
   catálogo de 40 cortes com avatares SVG gerados em código,
   seleção múltipla, categorias, upload, resultado completo
   ============================================================ */

/* ════════════════════════════════════════════════════════════
   1. CATÁLOGO DE CORTES
   shape  → silhueta do cabelo (desenhada em SVG)
   fade   → 'alto' | 'medio' | 'baixo' | null
   part   → risco lateral (linha na pele)
   beard  → 'cheia' | 'rala' | null
   ════════════════════════════════════════════════════════════ */
const CUTS = [
  { id:'foto01', nome:'Corte 01', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto02', nome:'Corte 02', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto03', nome:'Corte 03', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto04', nome:'Corte 04', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto05', nome:'Corte 05', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto06', nome:'Corte 06', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto07', nome:'Corte 07', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto08', nome:'Corte 08', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto09', nome:'Corte 09', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto10', nome:'Corte 10', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto11', nome:'Corte 11', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto12', nome:'Corte 12', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto13', nome:'Corte 13', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto14', nome:'Corte 14', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto15', nome:'Corte 15', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto16', nome:'Corte 16', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto17', nome:'Corte 17', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto18', nome:'Corte 18', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto19', nome:'Corte 19', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto20', nome:'Corte 20', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto21', nome:'Corte 21', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto22', nome:'Corte 22', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto23', nome:'Corte 23', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto24', nome:'Corte 24', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto25', nome:'Corte 25', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto26', nome:'Corte 26', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto27', nome:'Corte 27', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto28', nome:'Corte 28', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto29', nome:'Corte 29', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto30', nome:'Corte 30', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto31', nome:'Corte 31', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto32', nome:'Corte 32', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto33', nome:'Corte 33', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto34', nome:'Corte 34', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto35', nome:'Corte 35', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto36', nome:'Corte 36', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto37', nome:'Corte 37', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto38', nome:'Corte 38', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto39', nome:'Corte 39', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto40', nome:'Corte 40', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto41', nome:'Corte 41', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto42', nome:'Corte 42', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto43', nome:'Corte 43', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto44', nome:'Corte 44', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
  { id:'foto45', nome:'Corte 45', cat:'todos', shape:'short', fade:null, part:false, beard:null,
    desc:'Aguardando nome e descrição.', det:['—','—','—','—'] },
];

/* Nomes das categorias para as abas */
const CATS = [
  { id:'todos', nome:'Todos' },
];

/* ════════════════════════════════════════════════════════════
   2. GERADOR DE AVATAR SVG
   Desenha um avatar frontal: rosto + cabelo específico do corte
   ════════════════════════════════════════════════════════════ */
const SKIN = '#D9E1EC';
const HAIR = '#13294B';

/* Silhuetas de cabelo — cada corte aponta para uma delas */
const SHAPES = {
  buzz:   `<path d="M35,56 C35,33 45,25 60,25 C75,25 85,33 85,56 C83,43 73,35 60,35 C47,35 37,43 35,56 Z" fill="${HAIR}"/>`,
  short:  `<path d="M34,58 C34,28 45,19 60,19 C75,19 86,28 86,58 C84,42 74,33 60,33 C46,33 36,42 34,58 Z" fill="${HAIR}"/>`,
  crop:   `<path d="M34,56 C34,24 46,16 60,16 C74,16 86,24 86,56 L83,56 C83,46 82,42 79,40 L41,40 C38,42 37,46 37,56 Z" fill="${HAIR}"/>`,
  pomp:   `<path d="M34,54 C34,36 36,14 58,11 C78,8 86,28 86,54 C84,38 76,28 62,28 C48,28 38,40 34,54 Z" fill="${HAIR}"/>`,
  quiff:  `<path d="M34,54 C34,34 40,22 48,16 L52,24 L57,12 L61,22 L67,11 L71,22 C81,26 86,38 86,54 C84,40 74,30 60,30 C46,30 36,40 34,54 Z" fill="${HAIR}"/>`,
  slick:  `<path d="M34,56 C34,26 45,18 60,18 C75,18 86,26 86,56 C84,40 74,32 60,32 C46,32 36,40 34,56 Z" fill="${HAIR}"/>
           <path d="M44,23 C52,20 68,20 76,23 M42,28 C52,24 70,24 78,28" stroke="${SKIN}" stroke-width="1.6" fill="none" opacity=".65"/>`,
  fringe: `<path d="M34,56 C34,26 45,17 60,17 C75,17 86,26 86,56 C85,44 81,36 71,34 L44,46 C38,48 35,52 34,56 Z" fill="${HAIR}"/>`,
  messy:  `<path d="M34,54 C32,40 36,30 42,24 L38,16 L48,22 L50,12 L58,20 L64,10 L70,20 L78,14 L76,24 C84,30 87,42 86,54 C82,40 72,32 60,32 C48,32 38,42 34,54 Z" fill="${HAIR}"/>`,
  hawk:   `<path d="M49,34 C49,14 71,14 71,34 C66,26 54,26 49,34 Z" fill="${HAIR}"/>
           <path d="M37,52 C37,40 46,33 60,33 C74,33 83,40 83,52 C80,44 70,40 60,40 C50,40 40,44 37,52 Z" fill="${HAIR}" opacity=".45"/>`,
  afro:   `<circle cx="60" cy="35" r="29" fill="${HAIR}"/>`,
  curly:  `<g fill="${HAIR}"><circle cx="44" cy="33" r="13"/><circle cx="60" cy="27" r="14"/><circle cx="76" cy="33" r="13"/>
           <path d="M33,52 C40,37 80,37 87,52 C80,45 40,45 33,52 Z"/></g>`,
  waves:  `<path d="M35,56 C35,33 45,25 60,25 C75,25 85,33 85,56 C83,43 73,35 60,35 C47,35 37,43 35,56 Z" fill="${HAIR}"/>
           <path d="M43,33 q4,-3.5 8,0 M53,29 q4,-3.5 8,0 M63,29 q4,-3.5 8,0 M48,39 q4,-3.5 8,0 M59,38 q4,-3.5 8,0" stroke="${SKIN}" stroke-width="1.4" fill="none" opacity=".8"/>`,
  twists: `<g fill="${HAIR}"><circle cx="42" cy="35" r="5.5"/><circle cx="51" cy="29" r="5.5"/><circle cx="60" cy="27" r="5.5"/><circle cx="69" cy="29" r="5.5"/><circle cx="78" cy="35" r="5.5"/>
           <circle cx="46" cy="42" r="5"/><circle cx="55" cy="37" r="5"/><circle cx="65" cy="37" r="5"/><circle cx="74" cy="42" r="5"/></g>`,
  dreads: `<g fill="${HAIR}"><rect x="39" y="24" width="5.5" height="17" rx="2.7" transform="rotate(-16 42 32)"/><rect x="48" y="19" width="5.5" height="18" rx="2.7" transform="rotate(-7 51 28)"/><rect x="57" y="17" width="5.5" height="19" rx="2.7"/><rect x="66" y="19" width="5.5" height="18" rx="2.7" transform="rotate(7 69 28)"/><rect x="75" y="24" width="5.5" height="17" rx="2.7" transform="rotate(16 78 32)"/>
           <path d="M37,52 C40,38 80,38 83,52 C78,45 42,45 37,52 Z"/></g>`,
  bun:    `<path d="M34,58 C34,28 45,19 60,19 C75,19 86,28 86,58 C84,42 74,33 60,33 C46,33 36,42 34,58 Z" fill="${HAIR}"/>
           <circle cx="60" cy="13" r="8.5" fill="${HAIR}"/>`,
  mullet: `<path d="M34,58 C34,28 45,19 60,19 C75,19 86,28 86,58 C84,42 74,33 60,33 C46,33 36,42 34,58 Z" fill="${HAIR}"/>
           <path d="M30,56 C27,80 29,94 33,102 L41,100 C37,88 37,72 38,58 Z" fill="${HAIR}"/>
           <path d="M90,56 C93,80 91,94 87,102 L79,100 C83,88 83,72 82,58 Z" fill="${HAIR}"/>`,
  long:   `<path d="M29,42 C29,16 91,16 91,42 L92,94 C92,103 83,106 79,103 L78,58 C70,50 50,50 42,58 L41,103 C37,106 28,103 28,94 Z" fill="${HAIR}"/>`,
  medium: `<path d="M30,42 C30,16 90,16 90,42 L90,76 C90,84 83,86 80,83 L78,54 C70,47 50,47 42,54 L40,83 C37,86 30,84 30,76 Z" fill="${HAIR}"/>`,
};

/* Cabelos que ficam ATRÁS do rosto (longos) */
const BEHIND = ['long', 'medium'];

/* ── Arte do corte: usa a imagem se o id tiver foto, senão SVG ─
   Como os ids provisórios são foto01..foto20, o arquivo tem o
   mesmo nome do id. Quando você renomear os cortes, basta manter
   este padrão ou ajustar o caminho abaixo.                       */
function cutArt(cut) {
  // tenta sempre carregar img/cortes/<id>.png; se não existir, cai no SVG via onerror
  return `<img src="img/cortes/${cut.id}.png" alt="${cut.nome}" loading="lazy"
           style="width:100%;height:100%;object-fit:contain;display:block"
           onerror="this.parentElement.innerHTML=window.cutSVG ? cutSVG(${JSON.stringify(cut).replace(/"/g,'&quot;')}) : ''"/>`;
}

/* Monta o SVG completo do avatar de um corte (fallback) */
function cutSVG(cut) {
  const hair = SHAPES[cut.shape] || SHAPES.short;
  const behind = BEHIND.includes(cut.shape);

  /* degradê lateral: faixa clara nas têmporas */
  let fade = '';
  if (cut.fade) {
    const top = { alto: 46, medio: 52, baixo: 58 }[cut.fade];
    fade = `<rect x="36.5" y="${top}" width="4.5" height="${72 - top}" rx="2.2" fill="url(#fg)"/>
            <rect x="79" y="${top}" width="4.5" height="${72 - top}" rx="2.2" fill="url(#fg)"/>`;
  }

  /* risco lateral navalhado */
  const part = cut.part
    ? `<path d="M45,22 L52,35" stroke="${SKIN}" stroke-width="3" stroke-linecap="round"/>` : '';

  /* barba */
  let beard = '';
  if (cut.beard) {
    const op = cut.beard === 'rala' ? '.4' : '1';
    beard = `<g fill="${HAIR}" opacity="${op}">
      <path d="M37,70 C38,93 47,102 60,102 C73,102 82,93 83,70 C80,87 72,94 60,94 C48,94 40,87 37,70 Z"/>
      <rect x="52" y="80" width="16" height="3.6" rx="1.8"/>
    </g>`;
  }

  return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#C3CEDD"/><stop offset="1" stop-color="#C3CEDD" stop-opacity="0"/>
    </linearGradient></defs>
    ${behind ? hair : ''}
    <ellipse cx="60" cy="68" rx="25" ry="29" fill="${SKIN}"/>
    <circle cx="34" cy="70" r="5" fill="${SKIN}"/>
    <circle cx="86" cy="70" r="5" fill="${SKIN}"/>
    <rect x="51" y="92" width="18" height="18" rx="5" fill="${SKIN}"/>
    <path d="M26,131 C28,112 42,105 60,105 C78,105 92,112 94,131 Z" fill="#0B1F3A"/>
    <circle cx="51" cy="64" r="1.8" fill="#13294B" opacity=".55"/>
    <circle cx="69" cy="64" r="1.8" fill="#13294B" opacity=".55"/>
    ${behind ? '' : hair}
    ${fade}${part}${beard}
  </svg>`;
}

/* ════════════════════════════════════════════════════════════
   3. ESTADO
   ════════════════════════════════════════════════════════════ */
const SIM = {
  selected: [],      // id do corte escolhido (seleção única)
  activeCut: null,   // corte exibido no resultado
  photoData: null,   // dataURL da foto enviada
  left: 2            // testes gratuitos restantes
};

/* ════════════════════════════════════════════════════════════
   4. CATÁLOGO — renderização, abas e seleção
   ════════════════════════════════════════════════════════════ */
function renderTabs() {
  document.getElementById('catTabs').innerHTML = CATS.map((c, i) =>
    `<button class="cat-tab${i === 0 ? ' active' : ''}" onclick="filterCat('${c.id}',this)" type="button">${c.nome}</button>`
  ).join('');
}

function renderCatalog() {
  document.getElementById('catalog').innerHTML = CUTS.map(cut => `
    <div class="cut-card-wrap" id="wrap-${cut.id}" data-cat="${cut.cat}">
      <div class="cut-card" id="card-${cut.id}" onclick="toggleCut('${cut.id}')">
        <div class="cut-card__check" id="chk-${cut.id}"></div>
        <button class="cut-card__info" onclick="event.stopPropagation();openInfo('${cut.id}')" type="button" aria-label="Detalhes">i</button>
        <div class="cut-card__art">${cutArt(cut)}</div>
        <div class="cut-card__name">${cut.nome}</div>
      </div>
    </div>`
  ).join('');
}

function filterCat(catId, el) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.cut-card-wrap').forEach(wrap => {
    wrap.style.display = (catId === 'todos' || wrap.dataset.cat === catId) ? '' : 'none';
  });
}

function toggleCut(id) {
  // seleção única — clicar no mesmo desmarca, clicar em outro substitui
  SIM.selected = SIM.selected.includes(id) ? [] : [id];
  updateSelection();
}

function updateSelection() {
  // visual dos cards
  CUTS.forEach(cut => {
    const wrap = document.getElementById('wrap-' + cut.id);
    const chk  = document.getElementById('chk-' + cut.id);
    const on   = SIM.selected.includes(cut.id);
    if (wrap) wrap.classList.toggle('selected', on);
    chk.innerHTML = on ? '✓' : '';
    chk.classList.toggle('on', on);
  });

  // barra inferior
  const bar = document.getElementById('selectBar');
  const n = SIM.selected.length;
  bar.classList.toggle('open', n > 0);
  set('selCount', n + (n === 1 ? ' corte selecionado' : ' cortes selecionados'));

  document.getElementById('selThumbs').innerHTML = SIM.selected.map(id => {
    const cut = CUTS.find(c => c.id === id);
    return `<div class="sel-thumb" title="${cut.nome}">
      ${cutArt(cut)}
      <button class="sel-thumb__x" onclick="toggleCut('${id}')" type="button" aria-label="Remover">✕</button>
    </div>`;
  }).join('');
}

function clearSel() {
  SIM.selected = [];
  updateSelection();
}

/* ── Modal de detalhes do corte (ícone i) ──────────────────── */
function openInfo(id) {
  const cut = CUTS.find(c => c.id === id);
  document.getElementById('infoArt').innerHTML  = cutArt(cut);
  set('infoName', cut.nome);
  set('infoDesc', cut.desc);
  document.getElementById('infoDet').innerHTML = cut.det.map(d => `<span class="badge badge--gray">${d}</span>`).join('');
  openModal('mInfo');
}

/* ════════════════════════════════════════════════════════════
   5. FLUXO: catálogo → foto → resultado
   ════════════════════════════════════════════════════════════ */
function goPhotoStep() {
  if (!SIM.selected.length) return;
  document.getElementById('view-catalog').style.display = 'none';
  document.getElementById('view-sim').style.display = 'block';
  document.getElementById('uploadStage').style.display = 'block';
  document.getElementById('resultStage').style.display = 'none';
  renderChosenChips('chosenChips');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToCatalog() {
  document.getElementById('view-sim').style.display = 'none';
  document.getElementById('view-catalog').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderChosenChips(targetId, clickable = false) {
  document.getElementById(targetId).innerHTML = SIM.selected.map(id => {
    const cut = CUTS.find(c => c.id === id);
    const active = SIM.activeCut === id ? ' active' : '';
    const click = clickable ? `onclick="switchResult('${id}')"` : '';
    return `<button class="chosen-chip${active}" ${click} type="button">
      <span class="chosen-chip__art">${cutArt(cut)}</span>${cut.nome}
    </button>`;
  }).join('');
}

/* ── Upload da foto ────────────────────────────────────────── */
function onPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    SIM.photoData = e.target.result;
    document.getElementById('dzIcon').textContent  = '✅';
    document.getElementById('dzTitle').textContent = 'Foto carregada!';
    checkBtn();
  };
  reader.readAsDataURL(input.files[0]);
}

function checkBtn() {
  document.getElementById('btnSim').disabled = !(SIM.selected.length && SIM.photoData);
}

/* ── Simulação ─────────────────────────────────────────────── */
function simulate() {
  if (SIM.left <= 0) {
    document.getElementById('paywall').style.display = 'block';
    return;
  }

  const btn = document.getElementById('btnSim');
  btn.disabled = true;
  btn.textContent = 'Gerando simulação...';

  setTimeout(() => {
    SIM.left--;
    SIM.activeCut = SIM.selected[0];

    // atualiza a quota
    const plural = SIM.left !== 1 ? 's' : '';
    set('quota', `🤖 ${SIM.left} teste${plural} gratuito${plural} restante${plural} este mês`);
    if (SIM.left === 0) document.getElementById('quota').style.background = 'rgba(229,56,59,.12)';

    btn.textContent = 'Simular com IA ✨';
    btn.disabled = false;

    document.getElementById('uploadStage').style.display = 'none';
    document.getElementById('resultStage').style.display = 'block';
    renderResult();
    toast('Simulação concluída! ✨', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 2000);
}

/* ── Tela de resultado "Seu novo visual" ───────────────────── */
function renderResult() {
  const cut = CUTS.find(c => c.id === SIM.activeCut);

  // chips para alternar entre os cortes escolhidos
  const chipsWrap = document.getElementById('resultChips');
  if (SIM.selected.length > 1) {
    chipsWrap.style.display = 'flex';
    renderChosenChips('resultChips', true);
  } else {
    chipsWrap.style.display = 'none';
  }

  // antes / depois
  document.getElementById('beforeImg').src = SIM.photoData;
  document.getElementById('afterPhoto').src = SIM.photoData;
  document.getElementById('afterBadge').innerHTML = cutArt(cut);

  // card do corte
  document.getElementById('rCutArt').innerHTML = cutArt(cut);
  set('rCutName', cut.nome);
  set('rCutDesc', cut.desc);
  document.getElementById('rCutTags').innerHTML =
    `<span class="badge badge--outline">✂ ${CATS.find(c => c.id === cut.cat).nome}</span>` +
    (cut.fade ? `<span class="badge badge--outline">📶 Degradê ${cut.fade}</span>` : '');

  // grade "Detalhes do corte"
  const icons = ['📶', '💇', '🧴', '⏱'];
  document.getElementById('rDetails').innerHTML = cut.det.map((d, i) => `
    <div class="detail-col">
      <div class="detail-col__icon">${icons[i]}</div>
      <div class="detail-col__label">${d}</div>
    </div>`).join('');
}

function switchResult(id) {
  SIM.activeCut = id;
  renderResult();
}

function chooseAnother() {
  document.getElementById('resultStage').style.display = 'none';
  backToCatalog();
}

function bookThisCut() {
  const cut = CUTS.find(c => c.id === SIM.activeCut);
  if (!cut) return;
  const params = new URLSearchParams({ from: 'sim', corte: cut.nome });
  window.location.href = 'booking.html?' + params;
}

/* ════════════════════════════════════════════════════════════
   6. INICIALIZAÇÃO
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderTabs();
  renderCatalog();
  updateSelection();
});

