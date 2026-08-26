/* ============================================================
   BarberKut — supabase.js
   Inicializa o cliente Supabase e sobrescreve window.supabase.
   Carregue APÓS o CDN: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   ⚠  Preencha as duas constantes abaixo com os valores do
      seu projeto em https://supabase.com → Settings → API
   ============================================================ */

const SUPABASE_URL      = 'https://hvqyedzrjlzgonkfgxwa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MY5393ntHPYgk1XlKYg76A_EIsYqANb';

(function () {
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[BarberKut] SDK do Supabase não encontrado. Verifique a tag <script> do CDN.');
    window.supabase = null;
    return;
  }
  const { createClient } = window.supabase;
  window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
