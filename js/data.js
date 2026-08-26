/* ============================================================
   BarberKut — data.js
   FONTE ÚNICA DE DADOS (mock). Carregado ANTES de index.js e
   barbearia.js. Quando o backend entrar, basta trocar este
   array por uma chamada ao Supabase — a UI não muda.

   Mapeamento para o banco (Supabase):
     SHOPS[]            → tabela  shops
       .hours          → tabela  shop_hours      (shop_id, weekday, open, close)
       .amenities      → tabela  shop_amenities  (shop_id, amenity)
       .services       → tabela  services        (id, shop_id, ...)
       .barbers        → tabela  barbers         (id, shop_id, ...)
       .reviews        → tabela  reviews         (id, shop_id, ...)
       .gallery        → tabela  shop_photos     (id, shop_id, url)
   ============================================================ */

const SHOPS = [
  {
    id: 'central',
    slug: 'barbearia-central',
    name: 'Barbearia Central',
    tagline: 'Tradição e estilo no coração de Timbó desde 2014.',
    cover: 'bc-g1',
    icon: '✂',
    rating: 4.9,
    reviews_count: 124,
    price_from: 35,
    established: 2014,
    is_open: true,
    verified: true,
    phone: '(47) 99100-0001',
    instagram: 'barbearia_central',
    address: {
      street: 'Rua Marechal Deodoro, 152',
      district: 'Centro',
      city: 'Timbó', state: 'SC',
      lat: -26.8230, lng: -49.2710,
      distance_km: 0.3
    },
    hours: {
      seg: ['09:00', '19:00'], ter: ['09:00', '19:00'], qua: ['09:00', '19:00'],
      qui: ['09:00', '20:00'], sex: ['09:00', '20:00'], sab: ['08:00', '17:00'], dom: null
    },
    amenities: ['wifi', 'card', 'pix', 'ac', 'coffee', 'parking', 'tv'],
    about: 'Referência em cortes clássicos e modernos no centro de Timbó. ' +
           'Nossa equipe une técnica apurada e atendimento próximo para você ' +
           'sair sempre no ponto. Ambiente climatizado, café cortesia e aquele ' +
           'papo bom enquanto a navalha faz a mágica.',
    rating_breakdown: { 5: 102, 4: 16, 3: 4, 2: 1, 1: 1 },
    gallery: [
      { grad: 'bc-g1', icon: '✂' }, { grad: 'bc-g4', icon: '💈' },
      { grad: 'bc-g3', icon: '🪒' }, { grad: 'bc-g6', icon: '🧔' },
      { grad: 'bc-g2', icon: '💺' }, { grad: 'bc-g5', icon: '🪞' }
    ],
    services: [
      { name: 'Corte Social',       desc: 'Corte clássico na tesoura e máquina.',      price: 35, duration: 30, popular: false },
      { name: 'Corte Degradê',      desc: 'Fade na régua, do zero ao topo.',           price: 40, duration: 40, popular: true },
      { name: 'Barba Terapia',      desc: 'Toalha quente, navalha e hidratação.',      price: 30, duration: 30, popular: false },
      { name: 'Combo Corte + Barba',desc: 'O pacote completo do BarberKut.',            price: 60, duration: 60, popular: true },
      { name: 'Pezinho / Acabamento',desc: 'Aquele retoque entre cortes.',             price: 15, duration: 15, popular: false },
      { name: 'Pigmentação de Barba',desc: 'Preenchimento e desenho dos fios.',        price: 45, duration: 45, popular: false }
    ],
    barbers: [
      { name: 'João Silva',    role: 'Barbeiro-chefe', initials: 'JS', rating: 5.0, specialty: 'Degradê & navalha' },
      { name: 'Rafael Costa',  role: 'Barbeiro',       initials: 'RC', rating: 4.9, specialty: 'Barba & pigmentação' },
      { name: 'Lucas Moraes',  role: 'Barbeiro',       initials: 'LM', rating: 4.8, specialty: 'Clássicos & social' },
      { name: 'André Krieger', role: 'Barbeiro',       initials: 'AK', rating: 4.9, specialty: 'Infantil & freestyle' }
    ],
    reviews: [
      { author: 'Pedro Alves',    initials: 'PA', rating: 5, date: '2026-06-10', service: 'Combo Corte + Barba', text: 'Melhor barbearia da cidade, sem exagero. Saí renovado e o degradê ficou impecável.' },
      { author: 'Marcos Lima',    initials: 'ML', rating: 5, date: '2026-06-08', service: 'Corte Degradê',       text: 'O João é fera no fade. Ambiente top, café bom e atendimento nota mil.' },
      { author: 'Carlos Mendes',  initials: 'CM', rating: 4, date: '2026-06-02', service: 'Barba Terapia',       text: 'Barba feita com capricho, toalha quente é outro nível. Só achei a espera um pouco longa.' },
      { author: 'Felipe Santos',  initials: 'FS', rating: 5, date: '2026-05-28', service: 'Corte Social',        text: 'Pontualidade e qualidade. Agendei pelo app e fui atendido na hora marcada.' },
      { author: 'Bruno Rocha',    initials: 'BR', rating: 5, date: '2026-05-21', service: 'Combo Corte + Barba', text: 'Virei cliente fixo. Recomendo de olhos fechados.' }
    ]
  },

  {
    id: 'studio-blade',
    slug: 'studio-blade',
    name: 'Studio Blade',
    tagline: 'Barbearia premium com a melhor experiência da Av. Principal.',
    cover: 'bc-g2',
    icon: '💈',
    rating: 4.8,
    reviews_count: 89,
    price_from: 45,
    established: 2018,
    is_open: true,
    verified: true,
    phone: '(47) 99100-0002',
    instagram: 'studio.blade',
    address: {
      street: 'Av. Getúlio Vargas, 880',
      district: 'Av. Principal',
      city: 'Timbó', state: 'SC',
      lat: -26.8195, lng: -49.2680,
      distance_km: 0.8
    },
    hours: {
      seg: ['10:00', '20:00'], ter: ['10:00', '20:00'], qua: ['10:00', '20:00'],
      qui: ['10:00', '21:00'], sex: ['10:00', '21:00'], sab: ['09:00', '18:00'], dom: null
    },
    amenities: ['wifi', 'card', 'pix', 'ac', 'beer', 'tv', 'kids'],
    about: 'Experiência premium do início ao fim. Cadeiras importadas, drinks ' +
           'de cortesia e profissionais especializados em visagismo. No Studio ' +
           'Blade o seu corte é pensado para o seu rosto e o seu estilo de vida.',
    rating_breakdown: { 5: 70, 4: 14, 3: 3, 2: 1, 1: 1 },
    gallery: [
      { grad: 'bc-g2', icon: '💈' }, { grad: 'bc-g1', icon: '✂' },
      { grad: 'bc-g5', icon: '🥃' }, { grad: 'bc-g4', icon: '💺' },
      { grad: 'bc-g6', icon: '🪞' }, { grad: 'bc-g3', icon: '🧔' }
    ],
    services: [
      { name: 'Corte Premium',       desc: 'Visagismo + corte personalizado.',         price: 55, duration: 50, popular: true },
      { name: 'Corte Degradê Navalhado',desc: 'Fade com acabamento na navalha.',        price: 50, duration: 45, popular: true },
      { name: 'Barba Premium',       desc: 'Ritual completo com óleos e balm.',         price: 45, duration: 40, popular: false },
      { name: 'Combo Executivo',     desc: 'Corte premium + barba premium.',            price: 90, duration: 80, popular: true },
      { name: 'Sobrancelha',         desc: 'Design masculino na navalha.',              price: 20, duration: 15, popular: false },
      { name: 'Platinado',           desc: 'Descoloração global com proteção.',         price: 120, duration: 120, popular: false }
    ],
    barbers: [
      { name: 'Diego Fernandes', role: 'Master Barber', initials: 'DF', rating: 5.0, specialty: 'Visagismo & premium' },
      { name: 'Thiago Nunes',    role: 'Barbeiro',      initials: 'TN', rating: 4.8, specialty: 'Coloração & platinado' },
      { name: 'Vinícius Alves',  role: 'Barbeiro',      initials: 'VA', rating: 4.7, specialty: 'Barba & navalha' }
    ],
    reviews: [
      { author: 'Rodrigo Lima',  initials: 'RL', rating: 5, date: '2026-06-12', service: 'Combo Executivo',  text: 'Atendimento de outro mundo. Drink de cortesia e corte perfeito. Vale cada centavo.' },
      { author: 'Gustavo Reis',  initials: 'GR', rating: 5, date: '2026-06-05', service: 'Corte Premium',    text: 'O Diego entende de visagismo de verdade. Mudou meu visual pra melhor.' },
      { author: 'Eduardo Pires', initials: 'EP', rating: 4, date: '2026-05-30', service: 'Barba Premium',    text: 'Ambiente sofisticado e barba impecável. Preço salgado, mas entrega.' },
      { author: 'Henrique Sá',   initials: 'HS', rating: 5, date: '2026-05-24', service: 'Platinado',        text: 'Platinado sem detonar o cabelo. Profissionais que sabem o que fazem.' }
    ]
  },

  {
    id: 'corte-arte',
    slug: 'corte-e-arte',
    name: 'Corte & Arte',
    tagline: 'Bom, bonito e barato no Bairro Sul.',
    cover: 'bc-g3',
    icon: '🪒',
    rating: 4.7,
    reviews_count: 67,
    price_from: 30,
    established: 2020,
    is_open: true,
    verified: false,
    phone: '(47) 99100-0003',
    instagram: 'corteearte.tb',
    address: {
      street: 'Rua das Palmeiras, 45',
      district: 'Bairro Sul',
      city: 'Timbó', state: 'SC',
      lat: -26.8280, lng: -49.2755,
      distance_km: 1.2
    },
    hours: {
      seg: ['08:30', '18:30'], ter: ['08:30', '18:30'], qua: ['08:30', '18:30'],
      qui: ['08:30', '18:30'], sex: ['08:30', '19:00'], sab: ['08:00', '16:00'], dom: null
    },
    amenities: ['wifi', 'card', 'pix', 'kids', 'parking'],
    about: 'A barbearia do bairro que todo mundo confia. Preço justo, ' +
           'cadeira sempre disponível e aquele corte caprichado pra família ' +
           'inteira — do filho ao avô. Aqui você é tratado como vizinho.',
    rating_breakdown: { 5: 48, 4: 14, 3: 3, 2: 1, 1: 1 },
    gallery: [
      { grad: 'bc-g3', icon: '🪒' }, { grad: 'bc-g1', icon: '✂' },
      { grad: 'bc-g6', icon: '🧒' }, { grad: 'bc-g4', icon: '💺' },
      { grad: 'bc-g2', icon: '💈' }, { grad: 'bc-g5', icon: '🪞' }
    ],
    services: [
      { name: 'Corte Social',        desc: 'Simples, rápido e bem feito.',             price: 30, duration: 30, popular: true },
      { name: 'Corte Infantil',      desc: 'Paciência e carinho com os pequenos.',     price: 25, duration: 30, popular: true },
      { name: 'Barba',               desc: 'Aparada ou feita na navalha.',             price: 25, duration: 25, popular: false },
      { name: 'Corte + Barba',       desc: 'Combo econômico do bairro.',               price: 50, duration: 55, popular: true },
      { name: 'Pezinho',             desc: 'Retoque caprichado.',                      price: 12, duration: 15, popular: false }
    ],
    barbers: [
      { name: 'Sandro Beber',  role: 'Proprietário', initials: 'SB', rating: 4.8, specialty: 'Social & infantil' },
      { name: 'Marcelo Dias',  role: 'Barbeiro',     initials: 'MD', rating: 4.6, specialty: 'Barba & acabamento' }
    ],
    reviews: [
      { author: 'José Pereira',  initials: 'JP', rating: 5, date: '2026-06-09', service: 'Corte Infantil', text: 'Levo meu filho sempre. Tem paciência com criança e o corte fica ótimo.' },
      { author: 'Antônio Melo',  initials: 'AM', rating: 4, date: '2026-06-01', service: 'Corte + Barba',   text: 'Preço justo e bom atendimento. Barbearia de confiança do bairro.' },
      { author: 'Wagner Souza',  initials: 'WS', rating: 5, date: '2026-05-22', service: 'Corte Social',    text: 'Rápido e bem feito. Sempre dá pra encaixar sem esperar muito.' }
    ]
  },

  {
    id: 'the-barber-shop',
    slug: 'the-barber-shop',
    name: 'The Barber Shop',
    tagline: 'A barbearia mais bem avaliada do Shopping Norte.',
    cover: 'bc-g4',
    icon: '✂',
    rating: 4.9,
    reviews_count: 201,
    price_from: 50,
    established: 2016,
    is_open: true,
    verified: true,
    phone: '(47) 99100-0004',
    instagram: 'thebarbershop.tb',
    address: {
      street: 'Shopping Norte, Loja 212',
      district: 'Shopping Norte',
      city: 'Timbó', state: 'SC',
      lat: -26.8260, lng: -49.2620,
      distance_km: 1.5
    },
    hours: {
      seg: ['10:00', '22:00'], ter: ['10:00', '22:00'], qua: ['10:00', '22:00'],
      qui: ['10:00', '22:00'], sex: ['10:00', '22:00'], sab: ['10:00', '22:00'], dom: ['13:00', '20:00']
    },
    amenities: ['wifi', 'card', 'pix', 'ac', 'beer', 'tv', 'parking', 'accessible'],
    about: 'No coração do Shopping Norte, aberta todos os dias até tarde. ' +
           'A combinação perfeita de conveniência e qualidade: agende, faça suas ' +
           'compras e seja chamado no horário. Equipe premiada e estrutura completa.',
    rating_breakdown: { 5: 178, 4: 18, 3: 3, 2: 1, 1: 1 },
    gallery: [
      { grad: 'bc-g4', icon: '✂' }, { grad: 'bc-g2', icon: '💈' },
      { grad: 'bc-g1', icon: '🏆' }, { grad: 'bc-g5', icon: '💺' },
      { grad: 'bc-g6', icon: '🪞' }, { grad: 'bc-g3', icon: '🥃' }
    ],
    services: [
      { name: 'Corte Assinatura',    desc: 'O corte que deu fama à casa.',             price: 50, duration: 45, popular: true },
      { name: 'Corte Degradê',       desc: 'Fade perfeito, do clássico ao ousado.',    price: 50, duration: 45, popular: true },
      { name: 'Barba Lenhador',      desc: 'Modelagem completa para barbas cheias.',   price: 45, duration: 40, popular: false },
      { name: 'Combo The Barber',    desc: 'Corte assinatura + barba lenhador.',       price: 85, duration: 80, popular: true },
      { name: 'Camuflagem de Fios Brancos', desc: 'Disfarce natural dos grisalhos.',   price: 60, duration: 50, popular: false },
      { name: 'Relaxamento Capilar', desc: 'Alinhamento e redução de volume.',         price: 80, duration: 90, popular: false }
    ],
    barbers: [
      { name: 'Felipe Garcia',  role: 'Barbeiro-chefe', initials: 'FG', rating: 5.0, specialty: 'Degradê & assinatura' },
      { name: 'Mateus Rocha',   role: 'Barbeiro',       initials: 'MR', rating: 4.9, specialty: 'Barba lenhador' },
      { name: 'Caio Bernardes', role: 'Barbeiro',       initials: 'CB', rating: 4.9, specialty: 'Camuflagem & cor' },
      { name: 'Igor Pacheco',   role: 'Barbeiro',       initials: 'IP', rating: 4.8, specialty: 'Relaxamento & social' }
    ],
    reviews: [
      { author: 'Leonardo Cruz', initials: 'LC', rating: 5, date: '2026-06-14', service: 'Combo The Barber', text: 'Simplesmente a melhor. Aberto até tarde, equipe impecável. 201 avaliações não mentem.' },
      { author: 'Daniel Otto',   initials: 'DO', rating: 5, date: '2026-06-11', service: 'Corte Assinatura', text: 'Corte assinatura é viciante. Sempre saio impecável e elogiado.' },
      { author: 'Ricardo Maas',  initials: 'RM', rating: 5, date: '2026-06-04', service: 'Barba Lenhador',   text: 'Minha barba nunca foi tão bem cuidada. O Mateus é especialista de verdade.' },
      { author: 'Fábio Lenz',    initials: 'FL', rating: 4, date: '2026-05-27', service: 'Corte Degradê',    text: 'Excelente, só lota nos fins de semana. Agende com antecedência.' },
      { author: 'Júlio Hammes',  initials: 'JH', rating: 5, date: '2026-05-19', service: 'Camuflagem de Fios Brancos', text: 'Disfarçou os brancos de forma super natural. Ninguém percebeu, só elogios.' }
    ]
  },

  {
    id: 'navalha-dourada',
    slug: 'navalha-dourada',
    name: 'Navalha Dourada',
    tagline: 'Clássica e elegante na Zona Leste.',
    cover: 'bc-g5',
    icon: '💈',
    rating: 4.6,
    reviews_count: 45,
    price_from: 35,
    established: 2019,
    is_open: false,
    opens_at: '14:00',
    verified: false,
    phone: '(47) 99100-0005',
    instagram: 'navalhadourada',
    address: {
      street: 'Rua Blumenau, 700',
      district: 'Zona Leste',
      city: 'Timbó', state: 'SC',
      lat: -26.8330, lng: -49.2690,
      distance_km: 2.1
    },
    hours: {
      seg: null, ter: ['14:00', '20:00'], qua: ['14:00', '20:00'],
      qui: ['14:00', '20:00'], sex: ['14:00', '21:00'], sab: ['09:00', '18:00'], dom: null
    },
    amenities: ['wifi', 'card', 'pix', 'coffee'],
    about: 'Barbearia de inspiração vintage, com cadeiras de couro e aquele ' +
           'clima de barbearia clássica italiana. Especialistas em barba ' +
           'desenhada e cortes atemporais. Abre à tarde para um atendimento ' +
           'sem pressa.',
    rating_breakdown: { 5: 30, 4: 10, 3: 3, 2: 1, 1: 1 },
    gallery: [
      { grad: 'bc-g5', icon: '💈' }, { grad: 'bc-g6', icon: '🪒' },
      { grad: 'bc-g1', icon: '🧔' }, { grad: 'bc-g3', icon: '💺' },
      { grad: 'bc-g4', icon: '🪞' }, { grad: 'bc-g2', icon: '☕' }
    ],
    services: [
      { name: 'Corte Clássico',     desc: 'Tesoura, pente e elegância atemporal.',     price: 35, duration: 35, popular: true },
      { name: 'Barba Desenhada',    desc: 'Contornos precisos na navalha.',            price: 35, duration: 35, popular: true },
      { name: 'Corte + Barba',      desc: 'O combo do cavalheiro.',                    price: 65, duration: 65, popular: false },
      { name: 'Tratamento Capilar', desc: 'Hidratação e massagem no couro.',           price: 40, duration: 40, popular: false }
    ],
    barbers: [
      { name: 'Otávio Bauer', role: 'Mestre barbeiro', initials: 'OB', rating: 4.7, specialty: 'Clássicos & barba' },
      { name: 'Renato Gomes', role: 'Barbeiro',        initials: 'RG', rating: 4.5, specialty: 'Cortes atemporais' }
    ],
    reviews: [
      { author: 'Paulo Vargas',  initials: 'PV', rating: 5, date: '2026-06-07', service: 'Barba Desenhada', text: 'O clima vintage é sensacional. Barba desenhada perfeita, parece outra pessoa.' },
      { author: 'Sérgio Lopes',  initials: 'SL', rating: 4, date: '2026-05-29', service: 'Corte Clássico',  text: 'Atendimento sem pressa, do jeito que gosto. Só abre à tarde, fique atento.' },
      { author: 'Cláudio Reuter',initials: 'CR', rating: 5, date: '2026-05-20', service: 'Corte + Barba',   text: 'Cadeira de couro, café e conversa boa. Experiência clássica de verdade.' }
    ]
  },

  {
    id: 'dom-barbeiro',
    slug: 'dom-barbeiro',
    name: 'Dom Barbeiro',
    tagline: 'Sofisticação e bom gosto no bairro Jardins.',
    cover: 'bc-g6',
    icon: '🪒',
    rating: 4.8,
    reviews_count: 112,
    price_from: 40,
    established: 2017,
    is_open: true,
    verified: true,
    phone: '(47) 99100-0006',
    instagram: 'dom.barbeiro',
    address: {
      street: 'Rua dos Jardins, 320',
      district: 'Jardins',
      city: 'Timbó', state: 'SC',
      lat: -26.8150, lng: -49.2820,
      distance_km: 2.8
    },
    hours: {
      seg: ['09:00', '19:00'], ter: ['09:00', '19:00'], qua: ['09:00', '19:00'],
      qui: ['09:00', '20:00'], sex: ['09:00', '20:00'], sab: ['08:30', '17:00'], dom: null
    },
    amenities: ['wifi', 'card', 'pix', 'ac', 'coffee', 'parking', 'tv'],
    about: 'No charmoso bairro Jardins, a Dom Barbeiro alia técnica e ' +
           'sofisticação. Profissionais atualizados nas últimas tendências, ' +
           'produtos premium e um ambiente pensado para o seu conforto. ' +
           'Aqui o bom gosto é regra.',
    rating_breakdown: { 5: 92, 4: 16, 3: 2, 2: 1, 1: 1 },
    gallery: [
      { grad: 'bc-g6', icon: '🪒' }, { grad: 'bc-g4', icon: '✂' },
      { grad: 'bc-g2', icon: '💈' }, { grad: 'bc-g1', icon: '💺' },
      { grad: 'bc-g5', icon: '🪞' }, { grad: 'bc-g3', icon: '🧔' }
    ],
    services: [
      { name: 'Corte Dom',          desc: 'Corte personalizado com produtos premium.', price: 45, duration: 40, popular: true },
      { name: 'Corte Degradê',      desc: 'Fade moderno e bem definido.',               price: 45, duration: 40, popular: true },
      { name: 'Barba Premium',      desc: 'Ritual com toalha quente e óleos nobres.',   price: 40, duration: 35, popular: false },
      { name: 'Combo Dom',          desc: 'Corte Dom + barba premium.',                 price: 78, duration: 70, popular: true },
      { name: 'Hidratação Capilar', desc: 'Nutrição profunda dos fios.',                price: 35, duration: 30, popular: false },
      { name: 'Sobrancelha',        desc: 'Design masculino discreto.',                 price: 18, duration: 15, popular: false }
    ],
    barbers: [
      { name: 'Guilherme Stein', role: 'Barbeiro-chefe', initials: 'GS', rating: 4.9, specialty: 'Corte Dom & degradê' },
      { name: 'Murilo Hoffmann', role: 'Barbeiro',       initials: 'MH', rating: 4.8, specialty: 'Barba premium' },
      { name: 'Yuri Adriano',    role: 'Barbeiro',       initials: 'YA', rating: 4.7, specialty: 'Tendências & cor' }
    ],
    reviews: [
      { author: 'Alexandre Beck', initials: 'AB', rating: 5, date: '2026-06-13', service: 'Combo Dom',      text: 'Sofisticação do atendimento ao resultado. Produtos premium fazem diferença.' },
      { author: 'Rafael Imhof',   initials: 'RI', rating: 5, date: '2026-06-06', service: 'Corte Dom',      text: 'O Guilherme é antenado nas tendências. Sempre saio com o corte do momento.' },
      { author: 'Tiago Probst',   initials: 'TP', rating: 4, date: '2026-05-31', service: 'Barba Premium',  text: 'Ritual de barba muito bom. Ambiente confortável e cheiroso.' },
      { author: 'Nelson Fronza',  initials: 'NF', rating: 5, date: '2026-05-23', service: 'Combo Dom',      text: 'Bairro tranquilo, estacionamento fácil e serviço impecável. Recomendo.' }
    ]
  }
];

/* ── Catálogo de comodidades: ícone + rótulo ──────────────────
   Mapeia a chave salva em shop.amenities para exibição. */
const AMENITIES = {
  wifi:       { icon: '📶', label: 'Wi-Fi grátis' },
  card:       { icon: '💳', label: 'Aceita cartão' },
  pix:        { icon: '⚡', label: 'Pix' },
  ac:         { icon: '❄️', label: 'Ar-condicionado' },
  coffee:     { icon: '☕', label: 'Café cortesia' },
  beer:       { icon: '🍺', label: 'Cerveja cortesia' },
  parking:    { icon: '🅿️', label: 'Estacionamento' },
  tv:         { icon: '📺', label: 'TV / esportes' },
  kids:       { icon: '🧸', label: 'Espaço kids' },
  accessible: { icon: '♿', label: 'Acessível' }
};

/* Barbearias cadastradas pelo onboarding (mock via localStorage).
   No Supabase, seriam apenas mais linhas na tabela shops. */
function getMyShops() {
  try { return JSON.parse(localStorage.getItem('bk-my-shops') || '[]'); }
  catch { return []; }
}

/* ── Helpers de acesso (trocáveis por chamadas ao Supabase) ──── */
function getAllShops()    { return SHOPS.concat(getMyShops()); }
function getShopById(id)  { return getAllShops().find(s => s.id === id) || null; }

/* Disponibiliza no escopo global para as páginas que usam <script src> */
window.SHOPS = SHOPS;
window.AMENITIES = AMENITIES;
window.getMyShops = getMyShops;
window.getShopById = getShopById;
window.getAllShops = getAllShops;
