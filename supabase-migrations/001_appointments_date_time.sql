-- ============================================================
-- Migration 001 — appointments.appointment_date/appointment_time: text -> date/time
-- Rode isso no SQL Editor do Supabase, no projeto que já tem o schema
-- original (supabase-schema.sql) aplicado.
--
-- PRÉ-REQUISITO: os dados atuais de appointments podem ser descartados
-- (decisão tomada em 2026-09-09 — a tabela só tinha dados de teste).
-- Se em algum momento essa tabela passar a ter agendamentos reais,
-- NÃO rode um TRUNCATE numa migration futura sem antes migrar os dados.
-- ============================================================

TRUNCATE TABLE public.appointments;

ALTER TABLE public.appointments
  ALTER COLUMN appointment_date TYPE date USING appointment_date::date,
  ALTER COLUMN appointment_time TYPE time USING appointment_time::time,
  ALTER COLUMN appointment_date SET NOT NULL,
  ALTER COLUMN appointment_time SET NOT NULL;

-- Fecha a race condition da checagem de conflito feita em nível de aplicação
-- (AppointmentService, backend Java): duas requisições concorrentes para o
-- mesmo horário não conseguem mais commitar as duas.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_no_double_booking
  ON public.appointments (shop_id, barber, appointment_date, appointment_time)
  WHERE status <> 'cancelled';
