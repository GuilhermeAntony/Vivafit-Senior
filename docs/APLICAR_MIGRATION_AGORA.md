# ⚠️ AÇÃO NECESSÁRIA: Aplicar Migration no Supabase

## 🔴 Problema Identificado

A migration de correção **NÃO foi aplicada** no banco de dados Supabase de produção!

**Diagnóstico:**
- ✅ Tabela `completed_workouts` existe
- ❌ Coluna `exercise_name` não existe
- ❌ RLS pode não estar configurado
- ❌ Políticas podem estar faltando

**Impacto:**
- Treinos não estão sendo salvos corretamente
- App pode estar gerando erros ao tentar salvar

---

## 🚀 Solução: Aplicar Migration Agora

### Passo 1: Abrir Supabase Dashboard
1. Acesse: https://app.supabase.com
2. Faça login
3. Selecione o projeto: **VivaFit Seniors**

### Passo 2: Abrir SQL Editor
1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique em **New query** (ou `+` para nova query)

### Passo 3: Executar a Migration

**Copie e cole este SQL completo:**

\`\`\`sql
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
\`\`\`

### Passo 4: Executar
1. Clique em **Run** (ou pressione `Ctrl+Enter`)
2. Aguarde a execução (~2-3 segundos)
3. Verifique se apareceu **Success** (sem erros vermelhos)

---

## ✅ Verificar se Funcionou

Após executar a migration, rode este comando no terminal:

\`\`\`bash
node scripts/check-migration-applied.js
\`\`\`

**Resultado esperado:**
\`\`\`
✅ Tabela completed_workouts existe
✅ Coluna exercise_name existe
✅ RLS está ativo
🎉 MIGRATION FOI APLICADA CORRETAMENTE!
\`\`\`

---

## 🧪 Testar o App

Depois de aplicar a migration:

\`\`\`bash
# 1. Iniciar o app
npx expo start

# 2. No app:
# - Faça login
# - Complete um treino
# - Veja o log: "✅ Treino salvo no Supabase com sucesso!"

# 3. Verificar dados salvos
node scripts/check-supabase-data.js
\`\`\`

**Agora deve mostrar:**
\`\`\`
✅ Treinos no banco: 1
✅ Dados estão sendo salvos no Supabase
\`\`\`

---

## 🐛 Se Houver Erros

### Erro: "column user_id does not exist"
**Causa:** Tabela foi criada diferente do esperado

**Solução:** Execute primeiro a migration de criação:
\`\`\`sql
-- Ver em: supabase/migrations/20250919_create_completed_workouts.sql
\`\`\`

### Erro: "policy already exists"
**Causa:** Tentou executar a migration duas vezes

**Solução:** Ignore, a migration já foi aplicada. Verifique:
\`\`\`bash
node scripts/check-migration-applied.js
\`\`\`

### Erro: "permission denied"
**Causa:** Sem permissão de admin no banco

**Solução:** Use uma conta com permissões de administrador

---

## 📊 Status Atual

**Antes da Migration:**
- ❌ Treinos NÃO salvam no banco
- ❌ Dados apenas no AsyncStorage local
- ❌ Sem sincronização entre dispositivos

**Depois da Migration:**
- ✅ Treinos salvam no Supabase
- ✅ Dados sincronizam automaticamente
- ✅ Backup em nuvem funcionando
- ✅ Multi-dispositivo funcional

---

## ⏰ Tempo Estimado

- Abrir Dashboard: 30 segundos
- Copiar/colar SQL: 30 segundos
- Executar: 5 segundos
- Verificar: 10 segundos

**Total: ~1-2 minutos** ⚡

---

**⚠️ IMPORTANTE:** Sem aplicar esta migration, o app NÃO salvará treinos no Supabase!

Execute agora para começar a salvar dados na nuvem! 🚀
