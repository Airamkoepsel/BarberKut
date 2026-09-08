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
  /* ── DEGRADÊ ──────────────────────────────────────────────── */
  { id:'foto01', nome:'Degradê Baixo', cat:'degradê', shape:'short', fade:'baixo', part:false, beard:null,
    desc:'Transição suave começando nas laterais baixas. Visual limpo e versátil para qualquer ocasião.',
    det:['Degradê baixo','Casual / Social','Quinzenal','30 min'] },
  { id:'foto02', nome:'Degradê Médio', cat:'degradê', shape:'short', fade:'medio', part:false, beard:null,
    desc:'Clássico das barbearias brasileiras. Equilíbrio perfeito entre ousado e elegante.',
    det:['Degradê médio','Casual','Quinzenal','35 min'] },
  { id:'foto03', nome:'Degradê Alto', cat:'degradê', shape:'short', fade:'alto', part:false, beard:null,
    desc:'Contraste marcante entre o topo e as laterais. Moderno e de alta manutenção.',
    det:['Degradê alto','Moderno','Semanal','40 min'] },
  { id:'foto04', nome:'Degradê com Risco', cat:'degradê', shape:'short', fade:'alto', part:true, beard:null,
    desc:'Degradê alto com risco lateral navalhado. Personalidade e estilo definidos.',
    det:['Degradê alto','Estiloso','Semanal','45 min'] },
  { id:'foto05', nome:'Skin Fade', cat:'degradê', shape:'crop', fade:'alto', part:false, beard:null,
    desc:'Degradê que vai até a pele — zero na nuca e laterais. O mais ousado dos fades.',
    det:['Skin fade','Arrojado','Semanal','45 min'] },
  { id:'foto06', nome:'Degradê + Barba', cat:'degradê', shape:'short', fade:'medio', part:false, beard:'cheia',
    desc:'Combinação clássica: degradê médio com barba bem delineada. Visual completo.',
    det:['Degradê médio','Viril','Quinzenal','50 min'] },
  { id:'foto07', nome:'Drop Fade', cat:'degradê', shape:'short', fade:'alto', part:false, beard:null,
    desc:'O fade "cai" atrás da orelha criando um arco elegante. Visual artístico e moderno.',
    det:['Drop fade','Arrojado','Semanal','45 min'] },
  { id:'foto08', nome:'Taper Fade', cat:'degradê', shape:'short', fade:'baixo', part:false, beard:null,
    desc:'Transição mais longa e gradual. Adequado para ambientes formais e informais.',
    det:['Taper fade','Versátil','Mensal','30 min'] },
  { id:'foto09', nome:'Shadow Fade', cat:'degradê', shape:'short', fade:'medio', part:false, beard:'rala',
    desc:'Degradê que cria uma "sombra" nas laterais. Efeito tridimensional marcante.',
    det:['Shadow fade','Moderno','Quinzenal','40 min'] },
  { id:'foto10', nome:'Degradê Americano', cat:'degradê', shape:'short', fade:'medio', part:true, beard:null,
    desc:'O clássico americano: degradê médio com risco e topo definido. Nunca sai de moda.',
    det:['Degradê médio','Clássico','Quinzenal','40 min'] },

  /* ── CLÁSSICO ─────────────────────────────────────────────── */
  { id:'foto11', nome:'Social Clássico', cat:'classico', shape:'slick', fade:null, part:true, beard:null,
    desc:'Corte limpo, penteado de lado. Ideal para entrevistas, formaturas e eventos.',
    det:['Sem degradê','Formal','Mensal','25 min'] },
  { id:'foto12', nome:'Corte Militar', cat:'classico', shape:'buzz', fade:null, part:false, beard:null,
    desc:'Simples, viril e prático. Buzz cut uniforme que dispensa manutenção diária.',
    det:['Sem degradê','Esportivo','Mensal','15 min'] },
  { id:'foto13', nome:'Côco Americano', cat:'classico', shape:'crop', fade:null, part:false, beard:null,
    desc:'Crew cut clássico com topo nivelado. Masculinidade e praticidade em um corte só.',
    det:['Sem degradê','Esportivo','Mensal','20 min'] },
  { id:'foto14', nome:'Corte de Lado', cat:'classico', shape:'slick', fade:'baixo', part:true, beard:null,
    desc:'Risco definido com topo penteado lateralmente. Elegante e atemporal.',
    det:['Degradê baixo','Elegante','Quinzenal','30 min'] },
  { id:'foto15', nome:'Ivy League', cat:'classico', shape:'slick', fade:null, part:true, beard:null,
    desc:'Derivado do crew cut com franja longa penteada. Estilo universitário sofisticado.',
    det:['Sem degradê','Sofisticado','Mensal','25 min'] },
  { id:'foto16', nome:'Caesar Cut', cat:'classico', shape:'fringe', fade:null, part:false, beard:null,
    desc:'Franja horizontal reta, popularizado nos anos 90. Voltou com tudo no estilo retrô.',
    det:['Sem degradê','Retrô','Mensal','20 min'] },
  { id:'foto17', nome:'Regularinho', cat:'classico', shape:'short', fade:null, part:false, beard:null,
    desc:'O corte mais pedido nas barbearias do Brasil. Simples, arrumado e sempre certeiro.',
    det:['Sem degradê','Casual','Mensal','20 min'] },

  /* ── MODERNO ──────────────────────────────────────────────── */
  { id:'foto18', nome:'Undercut', cat:'moderno', shape:'slick', fade:null, part:false, beard:null,
    desc:'Laterais e nuca raspadas, topo longo e livre. Contraste máximo e estilo único.',
    det:['Sem degradê','Alternativo','Quinzenal','35 min'] },
  { id:'foto19', nome:'Undercut Disconnected', cat:'moderno', shape:'slick', fade:'alto', part:false, beard:null,
    desc:'Linha de separação visível entre as laterais e o topo. Visual arrojado e ousado.',
    det:['Degradê alto','Arrojado','Semanal','40 min'] },
  { id:'foto20', nome:'Pompadour', cat:'moderno', shape:'pomp', fade:'medio', part:false, beard:null,
    desc:'Topo volumoso penteado para trás com degradê nas laterais. Rockabilly moderno.',
    det:['Degradê médio','Rockabilly','Quinzenal','40 min'] },
  { id:'foto21', nome:'Quiff Moderno', cat:'moderno', shape:'quiff', fade:'medio', part:false, beard:null,
    desc:'Volume na frente com laterais degradê. O queridinho dos homens estilosos de 2025.',
    det:['Degradê médio','Tendência','Quinzenal','40 min'] },
  { id:'foto22', nome:'Textured Crop', cat:'moderno', shape:'crop', fade:'alto', part:false, beard:null,
    desc:'Franja texturizada com skin fade alto. Muito popular no estilo europeu contemporâneo.',
    det:['Skin fade','Europeu','Semanal','40 min'] },
  { id:'foto23', nome:'French Crop', cat:'moderno', shape:'crop', fade:'medio', part:false, beard:null,
    desc:'Franja reta curta com degradê médio. Minimalista e muito elegante.',
    det:['Degradê médio','Minimalista','Quinzenal','35 min'] },
  { id:'foto24', nome:'Edgar Cut', cat:'moderno', shape:'crop', fade:'alto', part:false, beard:null,
    desc:'Franja reta e horizontal com skin fade. Surgiu nos EUA e conquistou o Brasil.',
    det:['Skin fade','Urbano','Semanal','40 min'] },
  { id:'foto25', nome:'Slick Back', cat:'moderno', shape:'slick', fade:'baixo', part:false, beard:null,
    desc:'Topo penteado todo para trás com gel. Elegância corporativa com toque moderno.',
    det:['Taper fade','Executivo','Mensal','25 min'] },
  { id:'foto26', nome:'Comb Over', cat:'moderno', shape:'slick', fade:'medio', part:true, beard:null,
    desc:'Risco lateral e topo penteado para o lado oposto. Clássico reinterpretado.',
    det:['Degradê médio','Sofisticado','Quinzenal','35 min'] },
  { id:'foto27', nome:'Mid Fade + Franja', cat:'moderno', shape:'fringe', fade:'medio', part:false, beard:null,
    desc:'Franja caída na testa com degradê médio nas laterais. Jovem e descontraído.',
    det:['Degradê médio','Jovem','Quinzenal','35 min'] },

  /* ── CACHEADO & AFRO ──────────────────────────────────────── */
  { id:'foto28', nome:'Cacheado Natural', cat:'cacheado', shape:'curly', fade:null, part:false, beard:null,
    desc:'Cachos soltos e bem definidos. Realça a textura natural do cabelo com produtos certos.',
    det:['Sem degradê','Natural','Mensal','30 min'] },
  { id:'foto29', nome:'Cacheado + Degradê', cat:'cacheado', shape:'curly', fade:'medio', part:false, beard:null,
    desc:'Cachos no topo com laterais degradê. O melhor dos dois mundos.',
    det:['Degradê médio','Moderno','Quinzenal','40 min'] },
  { id:'foto30', nome:'Afro Clássico', cat:'cacheado', shape:'afro', fade:null, part:false, beard:null,
    desc:'Afro arredondado e cheio. Símbolo de identidade e orgulho cultural.',
    det:['Sem degradê','Cultural','Mensal','25 min'] },
  { id:'foto31', nome:'Afro Degradê', cat:'cacheado', shape:'afro', fade:'medio', part:false, beard:null,
    desc:'Afro com degradê nas laterais e nuca. Moderno e elegante.',
    det:['Degradê médio','Moderno','Quinzenal','40 min'] },
  { id:'foto32', nome:'Ondas Definidas', cat:'cacheado', shape:'waves', fade:'baixo', part:false, beard:null,
    desc:'Ondas comprimidas e definidas com escova. Muito popular nos anos 90 e em alta hoje.',
    det:['Taper fade','Retrô','Quinzenal','35 min'] },
  { id:'foto33', nome:'Twist + Degradê', cat:'cacheado', shape:'twists', fade:'alto', part:false, beard:null,
    desc:'Twists no topo com degradê alto nas laterais. Estilo afrocentrado e moderno.',
    det:['Degradê alto','Afrocentrado','Semanal','45 min'] },
  { id:'foto34', nome:'Dreads Curtos', cat:'cacheado', shape:'dreads', fade:null, part:false, beard:null,
    desc:'Dreads iniciantes ou mini dreads. Processo de identidade que começa aqui.',
    det:['Sem degradê','Cultural','Mensal','60 min'] },
  { id:'foto35', nome:'Crespo Estilizado', cat:'cacheado', shape:'afro', fade:'alto', part:false, beard:'rala',
    desc:'Cabelo crespo modelado com degradê alto e barba leve. Personalidade marcante.',
    det:['Degradê alto','Marcante','Semanal','45 min'] },

  /* ── LONGO ────────────────────────────────────────────────── */
  { id:'foto36', nome:'Coque Masculino', cat:'longo', shape:'bun', fade:'medio', part:false, beard:null,
    desc:'Cabelo comprido preso em coque com degradê nas laterais. O "manbun" que não sai de moda.',
    det:['Degradê médio','Despojado','Quinzenal','35 min'] },
  { id:'foto37', nome:'Cabelo Médio Solto', cat:'longo', shape:'medium', fade:null, part:false, beard:null,
    desc:'Comprimento médio com corte de ponta. Estilo surfista sem esforço.',
    det:['Sem degradê','Despojado','Bimestral','20 min'] },
  { id:'foto38', nome:'Long + Undercut', cat:'longo', shape:'long', fade:'alto', part:false, beard:null,
    desc:'Cabelo comprido no topo com laterais raspadas. Contraste máximo e estilo rockeiro.',
    det:['Skin fade','Rockeiro','Mensal','40 min'] },
  { id:'foto39', nome:'Estilo Surfista', cat:'longo', shape:'medium', fade:null, part:false, beard:'rala',
    desc:'Cabelo médio naturalmente caído com barba por fazer. Despretensioso e charmoso.',
    det:['Sem degradê','Praiano','Bimestral','20 min'] },

  /* ── ESPECIAL ─────────────────────────────────────────────── */
  { id:'foto40', nome:'Faux Hawk', cat:'especial', shape:'hawk', fade:'alto', part:false, beard:null,
    desc:'Visual de moicano sem raspar as laterais. Ousado para quem não quer ir longe demais.',
    det:['Degradê alto','Ousado','Quinzenal','40 min'] },
  { id:'foto41', nome:'Mohawk Suave', cat:'especial', shape:'hawk', fade:'alto', part:false, beard:null,
    desc:'Moicano clássico com laterais em degradê. Para quem quer se destacar de verdade.',
    det:['Skin fade','Punk','Semanal','45 min'] },
  { id:'foto42', nome:'Mullet Moderno', cat:'especial', shape:'mullet', fade:'medio', part:false, beard:null,
    desc:'O "mullet" reinterpretado: curto na frente e longo atrás com degradê. Voltou com força.',
    det:['Degradê médio','Retrô moderno','Quinzenal','40 min'] },
  { id:'foto43', nome:'Messy Hair', cat:'especial', shape:'messy', fade:null, part:false, beard:null,
    desc:'Cabelo propositalmente despentendo e texturizado. O "desleixo" que exige técnica.',
    det:['Sem degradê','Descolado','Mensal','25 min'] },
  { id:'foto44', nome:'Burst Fade', cat:'especial', shape:'short', fade:'alto', part:false, beard:'rala',
    desc:'Fade em formato semicircular ao redor da orelha. Visual artístico e impactante.',
    det:['Burst fade','Artístico','Semanal','50 min'] },
  { id:'foto45', nome:'Zero na Máquina', cat:'especial', shape:'buzz', fade:null, part:false, beard:'cheia',
    desc:'Cabelo zerado por igual em toda a cabeça. O mais prático e refrescante de todos.',
    det:['Sem degradê','Prático','Mensal','15 min'] },
];

/* Nomes das categorias para as abas */
const CATS = [
  { id:'todos',    nome:'Todos' },
  { id:'degradê',  nome:'Degradê' },
  { id:'classico', nome:'Clássico' },
  { id:'moderno',  nome:'Moderno' },
  { id:'cacheado', nome:'Cacheado' },
  { id:'longo',    nome:'Longo' },
  { id:'especial', nome:'Especial' },
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
  selected: [],        // id do corte escolhido (seleção única)
  activeCut: null,     // corte exibido no resultado
  photoData: null,     // dataURL da foto enviada
  generatedImage: null,// dataURL gerado pela IA
  left: 2              // testes gratuitos restantes
};

/* ════════════════════════════════════════════════════════════
   3b. FUNÇÕES DE IA — InstructPix2Pix via HuggingFace Spaces
   Modelo de edição guiado por texto: cada corte vira uma
   instrução em inglês que o modelo aplica à foto do usuário.
   ════════════════════════════════════════════════════════════ */

/* Redimensiona dataURL para max px (canvas) e converte para JPEG */
async function resizeDataUrl(dataUrl, maxPx = 512) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width  = Math.round(img.width  * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.82));
    };
    img.src = dataUrl;
  });
}

/* Space público do HairFastGAN — gratuito, sem token */
const HAIR_SPACE = 'https://airi-institute-hairfastgan.hf.space';

/* Foto real do corte, usada como referência pela IA.
   Os desenhos em img/cortes/ são só miniatura do catálogo: o modelo
   roda um detector de rosto na referência e precisa de foto frontal. */
function refPhotoUrl(cut) {
  return `img/ref/${cut.id}.jpg`;
}

/* Envia as imagens ao Space e devolve os caminhos temporários */
async function _uploadToSpace(blobs) {
  const form = new FormData();
  blobs.forEach((b, i) => form.append('files', b, `img${i}.jpg`));
  const resp = await fetch(`${HAIR_SPACE}/upload`, {
    method: 'POST', body: form, signal: AbortSignal.timeout(60000)
  });
  if (!resp.ok) throw new Error(`Falha ao enviar as imagens (${resp.status}).`);
  return resp.json();
}

/* O Gradio 4.x só aceita imagem neste formato */
function _fileData(path) {
  return { path, meta: { _type: 'gradio.FileData' } };
}

/* Lê o stream SSE do Gradio e devolve a URL da imagem gerada */
async function _readGradioSSE(streamResp) {
  const reader  = streamResp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === 'null') continue;

      let parsed;
      try { parsed = JSON.parse(raw); } catch { continue; }
      if (!Array.isArray(parsed)) continue;

      const erro = parsed[1]?.value;
      if (erro) { reader.cancel(); throw new Error(erro); }

      const path = parsed[0]?.value?.path;
      if (path) {
        reader.cancel();
        return `${HAIR_SPACE}/file=${path}`;
      }
    }
  }
  throw new Error('A IA terminou sem devolver imagem. Tente de novo.');
}

/* Troca o cabelo da foto pelo do corte escolhido (HairFastGAN) */
async function callHairFastGAN(faceDataUrl, cut) {
  const refResp = await fetch(refPhotoUrl(cut));
  if (!refResp.ok) {
    throw new Error(`O corte "${cut.nome}" ainda não tem foto de referência.`);
  }

  const faceBlob  = await (await fetch(faceDataUrl)).blob();
  const shapeBlob = await refResp.blob();
  const [facePath, shapePath] = await _uploadToSpace([faceBlob, shapeBlob]);

  const subResp = await fetch(`${HAIR_SPACE}/call/swap_hair`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // color = null preserva a cor natural do cabelo do usuário
    body: JSON.stringify({
      data: [_fileData(facePath), _fileData(shapePath), null, 'Article', 0, 15]
    }),
    signal: AbortSignal.timeout(30000)
  });
  if (!subResp.ok) throw new Error(`Erro ${subResp.status} ao iniciar a IA.`);

  const { event_id } = await subResp.json();
  if (!event_id) throw new Error('A IA não devolveu ID de processamento.');
  console.log('[BK-SIM] event_id:', event_id);

  const streamResp = await fetch(`${HAIR_SPACE}/call/swap_hair/${event_id}`, {
    signal: AbortSignal.timeout(240000)
  });
  return _readGradioSSE(streamResp);
}

/* Salva resultado no Supabase Storage (bucket: simulations) */
async function saveSimulation(imageDataUrl, cutNome) {
  const u = typeof bkUser === 'function' ? bkUser() : null;
  if (!u || !window.supabase || !imageDataUrl) return null;
  try {
    const [header, b64] = imageDataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const raw  = atob(b64);
    const arr  = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    const blob = new Blob([arr], { type: mime });

    const path = `${u.id}/${Date.now()}_${cutNome.replace(/\s+/g, '_')}.jpg`;
    const { data, error } = await window.supabase.storage
      .from('simulations').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) return null;

    const { data: pub } = window.supabase.storage.from('simulations').getPublicUrl(data.path);
    return pub?.publicUrl ?? null;
  } catch { return null; }
}

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
  SIM.generatedImage = null;
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
    // Mostra preview da foto no dropzone
    const dz = document.querySelector('.dropzone');
    dz.style.backgroundImage    = `url(${e.target.result})`;
    dz.style.backgroundSize     = 'cover';
    dz.style.backgroundPosition = 'center';
    document.getElementById('dzIcon').textContent  = '✅';
    document.getElementById('dzTitle').textContent = 'Foto carregada!';
    document.getElementById('dzTitle').style.background = 'rgba(0,0,0,.45)';
    document.getElementById('dzTitle').style.borderRadius = '6px';
    document.getElementById('dzTitle').style.padding = '2px 8px';
    document.getElementById('dzTitle').style.color = '#fff';
    checkBtn();
  };
  reader.readAsDataURL(input.files[0]);
}

function checkBtn() {
  document.getElementById('btnSim').disabled = !(SIM.selected.length && SIM.photoData);
}

/* ── Simulação (IA real — HairFastGAN) ─────────────────────── */
async function simulate() {
  if (SIM.left <= 0) {
    document.getElementById('paywall').style.display = 'block';
    return;
  }

  const btn = document.getElementById('btnSim');
  const cut  = CUTS.find(c => c.id === SIM.selected[0]);
  if (!cut || !SIM.photoData) return;

  btn.disabled = true;
  const progress = msg => { btn.textContent = msg; };

  try {
    progress('IA analisando seu rosto... ⏳ (30-90s)');
    const faceImg  = await resizeDataUrl(SIM.photoData, 1024);
    const result   = await callHairFastGAN(faceImg, cut);

    console.log('[BK-SIM] resultado da IA:', result);

    // Se a IA retornou URL externa, baixa e converte para blob local
    // (evita qualquer problema de CORS ou URL expirada)
    let localImage = result;
    if (result && result.startsWith('http')) {
      try {
        progress('Baixando imagem gerada...');
        const r = await fetch(result, { signal: AbortSignal.timeout(30000) });
        const blob = await r.blob();
        localImage = await new Promise(res => {
          const fr = new FileReader();
          fr.onload = () => res(fr.result);
          fr.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn('[BK-SIM] falha ao baixar imagem da IA, usando URL direta:', e.message);
      }
    }

    SIM.left--;
    SIM.activeCut      = SIM.selected[0];
    SIM.generatedImage = localImage;

    const plural = SIM.left !== 1 ? 's' : '';
    set('quota', `🤖 ${SIM.left} teste${plural} gratuito${plural} restante${plural} este mês`);
    if (SIM.left === 0) document.getElementById('quota').style.background = 'rgba(229,56,59,.12)';

    document.getElementById('uploadStage').style.display = 'none';
    document.getElementById('resultStage').style.display = 'block';
    renderResult();

    // Salva no Supabase Storage em background (não bloqueia a UI)
    saveSimulation(localImage, cut.nome).then(url => {
      if (url) toast('Simulação salva no seu perfil ✓', 'success');
    });

    toast('Simulação concluída! ✨', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    toast('❌ ' + (err.message || 'Erro na IA — tente novamente.'), 'error');
  } finally {
    progress('Simular com IA ✨');
    btn.disabled = false;
  }
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
  document.getElementById('beforeImg').src  = SIM.photoData;
  const afterImg = document.getElementById('afterPhoto');
  afterImg.onerror = () => {
    console.warn('[BK-SIM] imagem "depois" falhou ao carregar, usando foto original');
    afterImg.onerror = null;
    afterImg.src = SIM.photoData;
  };
  afterImg.src = SIM.generatedImage || SIM.photoData;
  console.log('[BK-SIM] exibindo afterPhoto src:', afterImg.src?.slice(0, 80));
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

