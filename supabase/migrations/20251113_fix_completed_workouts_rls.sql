-- Migration: Fix completed_workouts RLS and permissions
-- Date: 2025-11-13
-- Fixes: Enable RLS, add policies, and fix foreign key reference

-- Habilitar RLS na tabela completed_workouts
ALTER TABLE public.completed_workouts ENABLE ROW LEVEL SECURITY;

-- Corrigir a referência de user_id para auth.users ao invés de profiles
ALTER TABLE public.completed_workouts 
  DROP CONSTRAINT IF EXISTS completed_workouts_user_id_fkey;

ALTER TABLE public.completed_workouts 
  ADD CONSTRAINT completed_workouts_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Política: Usuários podem visualizar seus próprios treinos completados
CREATE POLICY "Users can view their own completed workouts"
ON public.completed_workouts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Política: Usuários podem inserir seus próprios treinos
CREATE POLICY "Users can insert their own completed workouts"
ON public.completed_workouts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Política: Usuários podem atualizar seus próprios treinos
CREATE POLICY "Users can update their own completed workouts"
ON public.completed_workouts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Política: Usuários podem deletar seus próprios treinos
CREATE POLICY "Users can delete their own completed workouts"
ON public.completed_workouts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Adicionar coluna exercise_name para compatibilidade com código existente
ALTER TABLE public.completed_workouts 
  ADD COLUMN IF NOT EXISTS exercise_name TEXT;

-- Criar índice para melhorar performance em consultas por usuário e data
CREATE INDEX IF NOT EXISTS idx_completed_workouts_user_date 
  ON public.completed_workouts(user_id, date DESC);

-- Comentários para documentação
COMMENT ON TABLE public.completed_workouts IS 'Armazena histórico de treinos completados pelos usuários';
COMMENT ON COLUMN public.completed_workouts.user_id IS 'Referência ao usuário que completou o treino';
COMMENT ON COLUMN public.completed_workouts.date IS 'Data do treino (YYYY-MM-DD)';
COMMENT ON COLUMN public.completed_workouts.steps IS 'Número de etapas/exercícios completados no treino';
COMMENT ON COLUMN public.completed_workouts.exercise IS 'Nome do exercício (campo original)';
COMMENT ON COLUMN public.completed_workouts.exercise_name IS 'Nome do exercício (compatibilidade com código)';
