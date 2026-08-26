/* ============================================================
   BarberKut — index.js
   Lógica da página inicial:
   filtros de descoberta, busca de barbearias, scroll suave
   ============================================================ */

/* ── Scroll suave até a seção de barbearias ────────────────── */
function scrollDisc() {
  document.getElementById('discoverySection')?.scrollIntoView({ behavior: 'smooth' });
}

/* ── Filtros por tag (chips: Aberto, Próximos, etc.) ───────── */
function filterTag(el, tag) {
  // marca o chip clicado como ativo
  document.querySelectorAll('#filterRow .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  // mostra apenas cards cujo data-tags contém a tag
  let count = 0;
  document.querySelectorAll('#barbershopGrid .card').forEach(card => {
    const show = tag === 'todos' || (card.dataset.tags || '').includes(tag);
    card.style.display = show ? '' : 'none';
    if (show) count++;
  });

  set('cardCount', count);
}

/* ── Busca por nome (input do hero) ────────────────────────── */
function filterCards() {
  const query = (document.getElementById('heroSearch')?.value || '').toLowerCase();

  let count = 0;
  document.querySelectorAll('#barbershopGrid .card').forEach(card => {
    const name = (card.querySelector('.barbershop-card__name')?.textContent || '').toLowerCase();
    const show = !query || name.includes(query);
    card.style.display = show ? '' : 'none';
    if (show) count++;
  });

  set('cardCount', count);
}


/* ============================================================
   MAPA DAS BARBEARIAS — Leaflet + OpenStreetMap (grátis)
   ============================================================ */

/* Deriva os pontos do mapa da fonte única (SHOPS em data.js).
   Assim, dados e mapa nunca ficam dessincronizados. */
const BARBEARIAS = (typeof getAllShops === 'function' ? getAllShops() : (window.SHOPS || [])).map(s => ({
  id:     s.id,
  nome:   s.name,
  lat:    s.address.lat,
  lng:    s.address.lng,
  nota:   s.rating,
  preco:  s.price_from,
  bairro: s.address.district
}));

let mapa = null;
let marcadorUsuario = null;

/* Cria o ícone navy personalizado do BarberKut para os marcadores */
function iconeBarbearia() {
  return L.divIcon({
    className: 'barberkut-marker',
    html: `<div style="background:#E5383B;width:30px;height:30px;border-radius:50% 50% 50% 0;
             transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.3);
             display:flex;align-items:center;justify-content:center;border:2px solid #fff">
             <span style="transform:rotate(45deg);font-size:14px">✂</span>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
}

/* Inicializa o mapa centralizado em Timbó com todas as barbearias */
function initMapa() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  // centro aproximado de Timbó/SC
  mapa = L.map('map').setView([-26.8230, -49.2710], 14);

  // camada de tiles do OpenStreetMap (gratuita)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);

  // adiciona um marcador para cada barbearia
  BARBEARIAS.forEach(b => {
    L.marker([b.lat, b.lng], { icon: iconeBarbearia() })
      .addTo(mapa)
      .bindPopup(`
        <div style="font-family:Inter,sans-serif;text-align:center;min-width:140px">
          <strong style="color:#0B1F3A;font-size:14px">${b.nome}</strong><br>
          <span style="color:#FF9F0A;font-weight:600">★ ${b.nota}</span>
          <span style="color:#6B7280;font-size:12px"> · ${b.bairro}</span><br>
          <span style="color:#6B7280;font-size:12px">A partir de <strong style="color:#0B1F3A">R$ ${b.preco}</strong></span><br>
          <a href="barbearia.html?id=${b.id}" style="display:inline-block;margin-top:6px;background:#E5383B;color:#fff;
             padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;text-decoration:none">Ver barbearia</a>
        </div>
      `);
  });
}

/* Fórmula de Haversine: distância em km entre dois pontos do globo */
function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
            Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* Pede a localização do usuário e mostra as barbearias mais próximas */
function locateMe() {
  const btn = document.getElementById('locBtn');
  if (!navigator.geolocation) {
    toast('Seu navegador não suporta geolocalização', 'error');
    return;
  }
  btn.textContent = '📍 Localizando...';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    // sucesso
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;

      // marcador azul do usuário
      if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
      marcadorUsuario = L.circleMarker([lat, lng], {
        radius: 9, fillColor: '#0B1F3A', color: '#fff', weight: 3, fillOpacity: 1
      }).addTo(mapa).bindPopup('<strong>Você está aqui</strong>').openPopup();

      mapa.setView([lat, lng], 14);

      // calcula a distância de cada barbearia e ordena
      const ordenadas = BARBEARIAS
        .map(b => ({ ...b, dist: distanciaKm(lat, lng, b.lat, b.lng) }))
        .sort((a, b) => a.dist - b.dist);

      const maisProxima = ordenadas[0];
      toast(`Mais próxima: ${maisProxima.nome} (${maisProxima.dist.toFixed(1)} km)`, 'success');

      btn.textContent = '📍 Localização ativada';
      btn.disabled = false;
    },
    // erro
    (err) => {
      const msg = err.code === 1
        ? 'Permissão de localização negada'
        : 'Não foi possível obter sua localização';
      toast(msg, 'warning');
      btn.textContent = '📍 Usar minha localização';
      btn.disabled = false;
    }
  );
}

/* Inicializa o mapa quando a página carregar */
document.addEventListener('DOMContentLoaded', initMapa);

