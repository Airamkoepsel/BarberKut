/* ============================================================
   BarberKut — supabase.js
   Inicializa o cliente Supabase e sobrescreve window.supabase.
   Carregue APÓS o CDN: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   ⚠  Preencha as duas constantes abaixo com os valores do
      seu projeto em https://supabase.com → Settings → API
   ============================================================ */

const SUPABASE_URL      = 'https://hvqyedzrjlzgonkfgxwa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cXllZHpyamx6Z29ua2ZneHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Nzg2MTQsImV4cCI6MjEwMzM1NDYxNH0.rk2ZxlU3JpRak9P0aTzsftpj_arq-B73_tjV2hGGNBw';

(function () {
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[BarberKut] SDK do Supabase não encontrado. Verifique a tag <script> do CDN.');
    window.supabase = null;
    return;
  }
  const { createClient } = window.supabase;
  window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
