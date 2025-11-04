-- Migration: create completed_workouts
-- Date: 2025-09-19

-- Habilita a extensão pgcrypto para gen_random_uuid()
create extension if not exists pgcrypto;

-- Tabela para armazenar treinos/completed workouts
create table if not exists public.completed_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  -- data do treino (YYYY-MM-DD)
  date date not null,
  -- número de passos/sets/etapas concluídas (ou qualquer métrica simples)
  steps integer not null default 0,
  -- nome do exercício ou rotina
  exercise text,
  -- duração total em segundos (opcional)
  duration_seconds integer,
  -- observações livres
  notes text,
  -- dados extras estruturados
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Índices para consultas usuais
create index if not exists idx_completed_workouts_user_id on public.completed_workouts(user_id);
create index if not exists idx_completed_workouts_date on public.completed_workouts(date desc);

-- Exemplo de permissão (opcional): conceder select/insert ao role anon
-- GRANT SELECT, INSERT ON public.completed_workouts TO anon;
