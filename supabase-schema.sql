-- ============================================================
-- BarberKut — Schema Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase.
-- Ordem: tabelas → seed → RLS → policies
-- ============================================================

-- ── 1. PROFILES (estende auth.users) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  phone      text,
  photo_url  text,
  created_at timestamptz DEFAULT now()
);

-- ── 2. SHOPS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shops (
  id              text PRIMARY KEY,
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  tagline         text,
  cover           text,
  icon            text,
  rating          numeric(3,1) DEFAULT 0,
  reviews_count   int DEFAULT 0,
  price_from      int,
  established     int,
  is_open         boolean DEFAULT false,
  opens_at        text,
  verified        boolean DEFAULT false,
  phone           text,
  instagram       text,
  about           text,
  street          text,
  district        text,
  city            text,
  state           text,
  lat             numeric(10,7),
  lng             numeric(10,7),
  distance_km     numeric(5,2),
  rating_breakdown jsonb DEFAULT '{}'::jsonb,
  owner_id        uuid REFERENCES public.profiles(id),
  created_at      timestamptz DEFAULT now()
);

-- ── 3. SHOP_HOURS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_hours (
  id         bigserial PRIMARY KEY,
  shop_id    text REFERENCES public.shops(id) ON DELETE CASCADE,
  weekday    text NOT NULL, -- 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'
  open_time  text,          -- NULL = fechado nesse dia
  close_time text
);

-- ── 4. SHOP_AMENITIES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_amenities (
  shop_id  text REFERENCES public.shops(id) ON DELETE CASCADE,
  amenity  text NOT NULL,
  PRIMARY KEY (shop_id, amenity)
);

-- ── 5. SERVICES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id           bigserial PRIMARY KEY,
  shop_id      text REFERENCES public.shops(id) ON DELETE CASCADE,
  name         text NOT NULL,
  description  text,
  price        int NOT NULL,
  duration_min int NOT NULL,
  popular      boolean DEFAULT false,
  sort_order   int DEFAULT 0
);

-- ── 6. BARBERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.barbers (
  id         bigserial PRIMARY KEY,
  shop_id    text REFERENCES public.shops(id) ON DELETE CASCADE,
  name       text NOT NULL,
  role       text,
  initials   text,
  rating     numeric(3,1),
  specialty  text,
  sort_order int DEFAULT 0
);

-- ── 7. REVIEWS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           bigserial PRIMARY KEY,
  shop_id      text REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id      uuid REFERENCES public.profiles(id),
  author       text NOT NULL,
  initials     text,
  rating       int CHECK (rating BETWEEN 1 AND 5),
  review_date  date,
  service      text,
  body         text,
  created_at   timestamptz DEFAULT now()
);

-- ── 8. SHOP_PHOTOS (galeria) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_photos (
  id         bigserial PRIMARY KEY,
  shop_id    text REFERENCES public.shops(id) ON DELETE CASCADE,
  grad       text,
  icon       text,
  url        text,
  sort_order int DEFAULT 0
);

-- ── 9. FAVORITES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  shop_id    text REFERENCES public.shops(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, shop_id)
);

-- ── 10. APPOINTMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id               bigserial PRIMARY KEY,
  user_id          uuid REFERENCES public.profiles(id),
  shop_id          text REFERENCES public.shops(id),
  shop_name        text,
  service          text,
  price            int,
  barber           text,
  appointment_date text,
  appointment_time text,
  status           text DEFAULT 'confirmed', -- confirmed | cancelled | completed
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- SEED: dados das 6 barbearias de Timbó
-- ============================================================

INSERT INTO public.shops (id, slug, name, tagline, cover, icon, rating, reviews_count, price_from, established, is_open, verified, phone, instagram, about, street, district, city, state, lat, lng, distance_km, rating_breakdown)
VALUES
('central','barbearia-central','Barbearia Central','Tradição e estilo no coração de Timbó desde 2014.','bc-g1','✂',4.9,124,35,2014,true,true,'(47) 99100-0001','barbearia_central','Referência em cortes clássicos e modernos no centro de Timbó. Nossa equipe une técnica apurada e atendimento próximo para você sair sempre no ponto. Ambiente climatizado, café cortesia e aquele papo bom enquanto a navalha faz a mágica.','Rua Marechal Deodoro, 152','Centro','Timbó','SC',-26.8230,-49.2710,0.3,'{"5":102,"4":16,"3":4,"2":1,"1":1}'),
('studio-blade','studio-blade','Studio Blade','Barbearia premium com a melhor experiência da Av. Principal.','bc-g2','💈',4.8,89,45,2018,true,true,'(47) 99100-0002','studio.blade','Experiência premium do início ao fim. Cadeiras importadas, drinks de cortesia e profissionais especializados em visagismo. No Studio Blade o seu corte é pensado para o seu rosto e o seu estilo de vida.','Av. Getúlio Vargas, 880','Av. Principal','Timbó','SC',-26.8195,-49.2680,0.8,'{"5":70,"4":14,"3":3,"2":1,"1":1}'),
('corte-arte','corte-e-arte','Corte & Arte','Bom, bonito e barato no Bairro Sul.','bc-g3','🪒',4.7,67,30,2020,true,false,'(47) 99100-0003','corteearte.tb','A barbearia do bairro que todo mundo confia. Preço justo, cadeira sempre disponível e aquele corte caprichado pra família inteira — do filho ao avô. Aqui você é tratado como vizinho.','Rua das Palmeiras, 45','Bairro Sul','Timbó','SC',-26.8280,-49.2755,1.2,'{"5":48,"4":14,"3":3,"2":1,"1":1}'),
('the-barber-shop','the-barber-shop','The Barber Shop','A barbearia mais bem avaliada do Shopping Norte.','bc-g4','✂',4.9,201,50,2016,true,true,'(47) 99100-0004','thebarbershop.tb','No coração do Shopping Norte, aberta todos os dias até tarde. A combinação perfeita de conveniência e qualidade: agende, faça suas compras e seja chamado no horário. Equipe premiada e estrutura completa.','Shopping Norte, Loja 212','Shopping Norte','Timbó','SC',-26.8260,-49.2620,1.5,'{"5":178,"4":18,"3":3,"2":1,"1":1}'),
('navalha-dourada','navalha-dourada','Navalha Dourada','Clássica e elegante na Zona Leste.','bc-g5','💈',4.6,45,35,2019,false,false,'(47) 99100-0005','navalhadourada','Barbearia de inspiração vintage, com cadeiras de couro e aquele clima de barbearia clássica italiana. Especialistas em barba desenhada e cortes atemporais. Abre à tarde para um atendimento sem pressa.','Rua Blumenau, 700','Zona Leste','Timbó','SC',-26.8330,-49.2690,2.1,'{"5":30,"4":10,"3":3,"2":1,"1":1}'),
('dom-barbeiro','dom-barbeiro','Dom Barbeiro','Sofisticação e bom gosto no bairro Jardins.','bc-g6','🪒',4.8,112,40,2017,true,true,'(47) 99100-0006','dom.barbeiro','No charmoso bairro Jardins, a Dom Barbeiro alia técnica e sofisticação. Profissionais atualizados nas últimas tendências, produtos premium e um ambiente pensado para o seu conforto. Aqui o bom gosto é regra.','Rua dos Jardins, 320','Jardins','Timbó','SC',-26.8150,-49.2820,2.8,'{"5":92,"4":16,"3":2,"2":1,"1":1}')
ON CONFLICT (id) DO NOTHING;

-- Horários
INSERT INTO public.shop_hours (shop_id, weekday, open_time, close_time) VALUES
('central','seg','09:00','19:00'),('central','ter','09:00','19:00'),('central','qua','09:00','19:00'),
('central','qui','09:00','20:00'),('central','sex','09:00','20:00'),('central','sab','08:00','17:00'),('central','dom',NULL,NULL),
('studio-blade','seg','10:00','20:00'),('studio-blade','ter','10:00','20:00'),('studio-blade','qua','10:00','20:00'),
('studio-blade','qui','10:00','21:00'),('studio-blade','sex','10:00','21:00'),('studio-blade','sab','09:00','18:00'),('studio-blade','dom',NULL,NULL),
('corte-arte','seg','08:30','18:30'),('corte-arte','ter','08:30','18:30'),('corte-arte','qua','08:30','18:30'),
('corte-arte','qui','08:30','18:30'),('corte-arte','sex','08:30','19:00'),('corte-arte','sab','08:00','16:00'),('corte-arte','dom',NULL,NULL),
('the-barber-shop','seg','10:00','22:00'),('the-barber-shop','ter','10:00','22:00'),('the-barber-shop','qua','10:00','22:00'),
('the-barber-shop','qui','10:00','22:00'),('the-barber-shop','sex','10:00','22:00'),('the-barber-shop','sab','10:00','22:00'),('the-barber-shop','dom','13:00','20:00'),
('navalha-dourada','seg',NULL,NULL),('navalha-dourada','ter','14:00','20:00'),('navalha-dourada','qua','14:00','20:00'),
('navalha-dourada','qui','14:00','20:00'),('navalha-dourada','sex','14:00','21:00'),('navalha-dourada','sab','09:00','18:00'),('navalha-dourada','dom',NULL,NULL),
('dom-barbeiro','seg','09:00','19:00'),('dom-barbeiro','ter','09:00','19:00'),('dom-barbeiro','qua','09:00','19:00'),
('dom-barbeiro','qui','09:00','20:00'),('dom-barbeiro','sex','09:00','20:00'),('dom-barbeiro','sab','08:30','17:00'),('dom-barbeiro','dom',NULL,NULL)
ON CONFLICT DO NOTHING;

-- Comodidades
INSERT INTO public.shop_amenities (shop_id, amenity) VALUES
('central','wifi'),('central','card'),('central','pix'),('central','ac'),('central','coffee'),('central','parking'),('central','tv'),
('studio-blade','wifi'),('studio-blade','card'),('studio-blade','pix'),('studio-blade','ac'),('studio-blade','beer'),('studio-blade','tv'),('studio-blade','kids'),
('corte-arte','wifi'),('corte-arte','card'),('corte-arte','pix'),('corte-arte','kids'),('corte-arte','parking'),
('the-barber-shop','wifi'),('the-barber-shop','card'),('the-barber-shop','pix'),('the-barber-shop','ac'),('the-barber-shop','beer'),('the-barber-shop','tv'),('the-barber-shop','parking'),('the-barber-shop','accessible'),
('navalha-dourada','wifi'),('navalha-dourada','card'),('navalha-dourada','pix'),('navalha-dourada','coffee'),
('dom-barbeiro','wifi'),('dom-barbeiro','card'),('dom-barbeiro','pix'),('dom-barbeiro','ac'),('dom-barbeiro','coffee'),('dom-barbeiro','parking'),('dom-barbeiro','tv')
ON CONFLICT DO NOTHING;

-- Serviços — Barbearia Central
INSERT INTO public.services (shop_id, name, description, price, duration_min, popular, sort_order) VALUES
('central','Corte Social','Corte clássico na tesoura e máquina.',35,30,false,1),
('central','Corte Degradê','Fade na régua, do zero ao topo.',40,40,true,2),
('central','Barba Terapia','Toalha quente, navalha e hidratação.',30,30,false,3),
('central','Combo Corte + Barba','O pacote completo do BarberKut.',60,60,true,4),
('central','Pezinho / Acabamento','Aquele retoque entre cortes.',15,15,false,5),
('central','Pigmentação de Barba','Preenchimento e desenho dos fios.',45,45,false,6),
-- Studio Blade
('studio-blade','Corte Premium','Visagismo + corte personalizado.',55,50,true,1),
('studio-blade','Corte Degradê Navalhado','Fade com acabamento na navalha.',50,45,true,2),
('studio-blade','Barba Premium','Ritual completo com óleos e balm.',45,40,false,3),
('studio-blade','Combo Executivo','Corte premium + barba premium.',90,80,true,4),
('studio-blade','Sobrancelha','Design masculino na navalha.',20,15,false,5),
('studio-blade','Platinado','Descoloração global com proteção.',120,120,false,6),
-- Corte & Arte
('corte-arte','Corte Social','Simples, rápido e bem feito.',30,30,true,1),
('corte-arte','Corte Infantil','Paciência e carinho com os pequenos.',25,30,true,2),
('corte-arte','Barba','Aparada ou feita na navalha.',25,25,false,3),
('corte-arte','Corte + Barba','Combo econômico do bairro.',50,55,true,4),
('corte-arte','Pezinho','Retoque caprichado.',12,15,false,5),
-- The Barber Shop
('the-barber-shop','Corte Assinatura','O corte que deu fama à casa.',50,45,true,1),
('the-barber-shop','Corte Degradê','Fade perfeito, do clássico ao ousado.',50,45,true,2),
('the-barber-shop','Barba Lenhador','Modelagem completa para barbas cheias.',45,40,false,3),
('the-barber-shop','Combo The Barber','Corte assinatura + barba lenhador.',85,80,true,4),
('the-barber-shop','Camuflagem de Fios Brancos','Disfarce natural dos grisalhos.',60,50,false,5),
('the-barber-shop','Relaxamento Capilar','Alinhamento e redução de volume.',80,90,false,6),
-- Navalha Dourada
('navalha-dourada','Corte Clássico','Tesoura, pente e elegância atemporal.',35,35,true,1),
('navalha-dourada','Barba Desenhada','Contornos precisos na navalha.',35,35,true,2),
('navalha-dourada','Corte + Barba','O combo do cavalheiro.',65,65,false,3),
('navalha-dourada','Tratamento Capilar','Hidratação e massagem no couro.',40,40,false,4),
-- Dom Barbeiro
('dom-barbeiro','Corte Dom','Corte personalizado com produtos premium.',45,40,true,1),
('dom-barbeiro','Corte Degradê','Fade moderno e bem definido.',45,40,true,2),
('dom-barbeiro','Barba Premium','Ritual com toalha quente e óleos nobres.',40,35,false,3),
('dom-barbeiro','Combo Dom','Corte Dom + barba premium.',78,70,true,4),
('dom-barbeiro','Hidratação Capilar','Nutrição profunda dos fios.',35,30,false,5),
('dom-barbeiro','Sobrancelha','Design masculino discreto.',18,15,false,6);

-- Barbeiros — Barbearia Central
INSERT INTO public.barbers (shop_id, name, role, initials, rating, specialty, sort_order) VALUES
('central','João Silva','Barbeiro-chefe','JS',5.0,'Degradê & navalha',1),
('central','Rafael Costa','Barbeiro','RC',4.9,'Barba & pigmentação',2),
('central','Lucas Moraes','Barbeiro','LM',4.8,'Clássicos & social',3),
('central','André Krieger','Barbeiro','AK',4.9,'Infantil & freestyle',4),
('studio-blade','Diego Fernandes','Master Barber','DF',5.0,'Visagismo & premium',1),
('studio-blade','Thiago Nunes','Barbeiro','TN',4.8,'Coloração & platinado',2),
('studio-blade','Vinícius Alves','Barbeiro','VA',4.7,'Barba & navalha',3),
('corte-arte','Sandro Beber','Proprietário','SB',4.8,'Social & infantil',1),
('corte-arte','Marcelo Dias','Barbeiro','MD',4.6,'Barba & acabamento',2),
('the-barber-shop','Felipe Garcia','Barbeiro-chefe','FG',5.0,'Degradê & assinatura',1),
('the-barber-shop','Mateus Rocha','Barbeiro','MR',4.9,'Barba lenhador',2),
('the-barber-shop','Caio Bernardes','Barbeiro','CB',4.9,'Camuflagem & cor',3),
('the-barber-shop','Igor Pacheco','Barbeiro','IP',4.8,'Relaxamento & social',4),
('navalha-dourada','Otávio Bauer','Mestre barbeiro','OB',4.7,'Clássicos & barba',1),
('navalha-dourada','Renato Gomes','Barbeiro','RG',4.5,'Cortes atemporais',2),
('dom-barbeiro','Guilherme Stein','Barbeiro-chefe','GS',4.9,'Corte Dom & degradê',1),
('dom-barbeiro','Murilo Hoffmann','Barbeiro','MH',4.8,'Barba premium',2),
('dom-barbeiro','Yuri Adriano','Barbeiro','YA',4.7,'Tendências & cor',3);

-- Reviews
INSERT INTO public.reviews (shop_id, author, initials, rating, review_date, service, body) VALUES
('central','Pedro Alves','PA',5,'2026-06-10','Combo Corte + Barba','Melhor barbearia da cidade, sem exagero. Saí renovado e o degradê ficou impecável.'),
('central','Marcos Lima','ML',5,'2026-06-08','Corte Degradê','O João é fera no fade. Ambiente top, café bom e atendimento nota mil.'),
('central','Carlos Mendes','CM',4,'2026-06-02','Barba Terapia','Barba feita com capricho, toalha quente é outro nível. Só achei a espera um pouco longa.'),
('central','Felipe Santos','FS',5,'2026-05-28','Corte Social','Pontualidade e qualidade. Agendei pelo app e fui atendido na hora marcada.'),
('central','Bruno Rocha','BR',5,'2026-05-21','Combo Corte + Barba','Virei cliente fixo. Recomendo de olhos fechados.'),
('studio-blade','Rodrigo Lima','RL',5,'2026-06-12','Combo Executivo','Atendimento de outro mundo. Drink de cortesia e corte perfeito. Vale cada centavo.'),
('studio-blade','Gustavo Reis','GR',5,'2026-06-05','Corte Premium','O Diego entende de visagismo de verdade. Mudou meu visual pra melhor.'),
('studio-blade','Eduardo Pires','EP',4,'2026-05-30','Barba Premium','Ambiente sofisticado e barba impecável. Preço salgado, mas entrega.'),
('studio-blade','Henrique Sá','HS',5,'2026-05-24','Platinado','Platinado sem detonar o cabelo. Profissionais que sabem o que fazem.'),
('corte-arte','José Pereira','JP',5,'2026-06-09','Corte Infantil','Levo meu filho sempre. Tem paciência com criança e o corte fica ótimo.'),
('corte-arte','Antônio Melo','AM',4,'2026-06-01','Corte + Barba','Preço justo e bom atendimento. Barbearia de confiança do bairro.'),
('corte-arte','Wagner Souza','WS',5,'2026-05-22','Corte Social','Rápido e bem feito. Sempre dá pra encaixar sem esperar muito.'),
('the-barber-shop','Leonardo Cruz','LC',5,'2026-06-14','Combo The Barber','Simplesmente a melhor. Aberto até tarde, equipe impecável. 201 avaliações não mentem.'),
('the-barber-shop','Daniel Otto','DO',5,'2026-06-11','Corte Assinatura','Corte assinatura é viciante. Sempre saio impecável e elogiado.'),
('the-barber-shop','Ricardo Maas','RM',5,'2026-06-04','Barba Lenhador','Minha barba nunca foi tão bem cuidada. O Mateus é especialista de verdade.'),
('the-barber-shop','Fábio Lenz','FL',4,'2026-05-27','Corte Degradê','Excelente, só lota nos fins de semana. Agende com antecedência.'),
('the-barber-shop','Júlio Hammes','JH',5,'2026-05-19','Camuflagem de Fios Brancos','Disfarçou os brancos de forma super natural. Ninguém percebeu, só elogios.'),
('navalha-dourada','Paulo Vargas','PV',5,'2026-06-07','Barba Desenhada','O clima vintage é sensacional. Barba desenhada perfeita, parece outra pessoa.'),
('navalha-dourada','Sérgio Lopes','SL',4,'2026-05-29','Corte Clássico','Atendimento sem pressa, do jeito que gosto. Só abre à tarde, fique atento.'),
('navalha-dourada','Cláudio Reuter','CR',5,'2026-05-20','Corte + Barba','Cadeira de couro, café e conversa boa. Experiência clássica de verdade.'),
('dom-barbeiro','Alexandre Beck','AB',5,'2026-06-13','Combo Dom','Sofisticação do atendimento ao resultado. Produtos premium fazem diferença.'),
('dom-barbeiro','Rafael Imhof','RI',5,'2026-06-06','Corte Dom','O Guilherme é antenado nas tendências. Sempre saio com o corte do momento.'),
('dom-barbeiro','Tiago Probst','TP',4,'2026-05-31','Barba Premium','Ritual de barba muito bom. Ambiente confortável e cheiroso.'),
('dom-barbeiro','Nelson Fronza','NF',5,'2026-05-23','Combo Dom','Bairro tranquilo, estacionamento fácil e serviço impecável. Recomendo.');

-- Fotos da galeria
INSERT INTO public.shop_photos (shop_id, grad, icon, sort_order) VALUES
('central','bc-g1','✂',1),('central','bc-g4','💈',2),('central','bc-g3','🪒',3),('central','bc-g6','🧔',4),('central','bc-g2','💺',5),('central','bc-g5','🪞',6),
('studio-blade','bc-g2','💈',1),('studio-blade','bc-g1','✂',2),('studio-blade','bc-g5','🥃',3),('studio-blade','bc-g4','💺',4),('studio-blade','bc-g6','🪞',5),('studio-blade','bc-g3','🧔',6),
('corte-arte','bc-g3','🪒',1),('corte-arte','bc-g1','✂',2),('corte-arte','bc-g6','🧒',3),('corte-arte','bc-g4','💺',4),('corte-arte','bc-g2','💈',5),('corte-arte','bc-g5','🪞',6),
('the-barber-shop','bc-g4','✂',1),('the-barber-shop','bc-g2','💈',2),('the-barber-shop','bc-g1','🏆',3),('the-barber-shop','bc-g5','💺',4),('the-barber-shop','bc-g6','🪞',5),('the-barber-shop','bc-g3','🥃',6),
('navalha-dourada','bc-g5','💈',1),('navalha-dourada','bc-g6','🪒',2),('navalha-dourada','bc-g1','🧔',3),('navalha-dourada','bc-g3','💺',4),('navalha-dourada','bc-g4','🪞',5),('navalha-dourada','bc-g2','☕',6),
('dom-barbeiro','bc-g6','🪒',1),('dom-barbeiro','bc-g4','✂',2),('dom-barbeiro','bc-g2','💈',3),('dom-barbeiro','bc-g1','💺',4),('dom-barbeiro','bc-g5','🪞',5),('dom-barbeiro','bc-g3','🧔',6);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_hours   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Leitura pública para dados das barbearias
CREATE POLICY "shops_public_read"         ON public.shops         FOR SELECT USING (true);
CREATE POLICY "shop_hours_public_read"    ON public.shop_hours    FOR SELECT USING (true);
CREATE POLICY "shop_amenities_public_read"ON public.shop_amenities FOR SELECT USING (true);
CREATE POLICY "services_public_read"      ON public.services      FOR SELECT USING (true);
CREATE POLICY "barbers_public_read"       ON public.barbers       FOR SELECT USING (true);
CREATE POLICY "reviews_public_read"       ON public.reviews       FOR SELECT USING (true);
CREATE POLICY "shop_photos_public_read"   ON public.shop_photos   FOR SELECT USING (true);

-- Profiles: usuário lê/edita só o próprio
CREATE POLICY "profiles_own_read"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Favoritos: usuário gerencia os próprios
CREATE POLICY "favorites_own_read"   ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_own_insert" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_own_delete" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Agendamentos: usuário gerencia os próprios
CREATE POLICY "appointments_own_read"   ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "appointments_own_insert" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "appointments_own_update" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);

-- Reviews: usuário insere e lê as próprias; leitura pública já coberta acima
CREATE POLICY "reviews_auth_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger: cria profile automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
