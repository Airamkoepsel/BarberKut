/* ============================================================
   BarberKut — api.js
   Cliente HTTP pra API Java (Spring Boot). Substitui as leituras/escritas
   que antes iam direto pro supabase-js. Login/cadastro continuam via
   Supabase Auth (window.supabase.auth.*) — aqui só anexamos o access_token
   dessa sessão como Bearer quando a rota exige autenticação.

   Ajuste API_BASE_URL para o endereço onde o backend Java está rodando
   (local: http://localhost:8080; produção: URL do serviço publicado).
   ============================================================ */

const API_BASE_URL = window.BARBERKUT_API_URL || 'http://localhost:8080';

async function bkApiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth && window.supabase) {
    const { data: { session } = {} } = await window.supabase.auth.getSession();
    if (session?.access_token) headers['Authorization'] = 'Bearer ' + session.access_token;
  }

  const res = await fetch(API_BASE_URL + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  let payload = null;
  try { payload = await res.json(); } catch { /* corpo vazio, ok */ }

  if (!res.ok) {
    const message = (payload && (payload.detail || payload.message)) || `Erro ${res.status} ao chamar ${path}`;
    throw new Error(message);
  }
  return payload;
}
