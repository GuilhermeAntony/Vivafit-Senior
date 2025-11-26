# Diagnóstico: Problema de Salvamento de Dados no Supabase

**Data**: 13 de novembro de 2025  
**Status**: 🔴 CRÍTICO - Dados não estão sendo salvos no Supabase

## Problema Identificado

Os dados de progressão e exercícios completados pelos usuários **NÃO estão sendo salvos no banco de dados Supabase**, apenas no AsyncStorage local do dispositivo.

## Causas Raiz

### 1. ❌ **Falta de Políticas RLS (Row Level Security)**

A tabela `completed_workouts` foi criada SEM políticas RLS, o que **bloqueia todas as operações de INSERT/UPDATE** mesmo para usuários autenticados.

**Evidência**: Arquivo `supabase/migrations/20250919_create_completed_workouts.sql`
- ✅ Tabela criada: `public.completed_workouts`
- ❌ **RLS NÃO foi habilitado**
- ❌ **Nenhuma política RLS foi criada**
- ❌ Apenas comentário sobre GRANT (linha 31, comentado)

```sql
-- Tabela existe, mas SEM políticas RLS
create table if not exists public.completed_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  date date not null,
  steps integer not null default 0,
  exercise text,
  -- ...
);

-- Sem ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
-- Sem CREATE POLICY ...
```

### 2. ❌ **Código não tenta salvar no Supabase**

**Arquivo**: `src/screens/Workout.tsx` - Função `finishAndSave()` (linhas 135-155)

```typescript
const finishAndSave = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const completedWorkouts = await AsyncStorage.getItem('completedWorkouts');
    const workouts = completedWorkouts ? JSON.parse(completedWorkouts) : [];
    workouts.push({
      date: today,
      steps: workoutSteps.length,
      exerciseName: exercise?.name || 'Treino Personalizado'
    });
    // ⚠️ APENAS salva localmente
    await AsyncStorage.setItem('completedWorkouts', JSON.stringify(workouts));
    
    // ❌ NÃO há tentativa de salvar no Supabase aqui!
    
    setWorkoutComplete(true);
    setIsActive(false);
    // ...
  }
};
```

### 3. ⚠️ **Incompatibilidade de Schema**

**Problema**: O código salva `exerciseName`, mas a tabela espera `exercise`:

- **AsyncStorage**: `{ date, steps, exerciseName }`
- **Tabela Supabase**: `{ date, steps, exercise }`
- **Inconsistência**: Campo com nome diferente

### 4. ⚠️ **Referência de Foreign Key Incorreta**

```sql
user_id uuid references public.profiles(id) on delete set null
```

**Problema**: Deveria ser `auth.users(id)` ou o campo precisa ser ajustado para corresponder ao ID correto do perfil.

## Impacto

### Funcionalidade Afetada
- ✅ **AsyncStorage**: Funciona (dados salvos localmente)
- ❌ **Supabase**: Não funciona (dados NUNCA são salvos)
- ❌ **Sincronização**: Impossível entre dispositivos
- ❌ **Backup**: Nenhum backup em nuvem
- ❌ **Histórico**: Perdido ao desinstalar o app

### Telas Afetadas
1. **Workout.tsx** - Não salva treinos completados no Supabase
2. **Progress.tsx** - Só exibe dados locais (linhas 25-36)
3. **History.tsx** - Só exibe dados locais (linhas 17-30)

## Comparação: Profile vs Completed Workouts

### ✅ **Profile (FUNCIONA)**
- RLS habilitado ✓
- Políticas criadas ✓
- Código faz INSERT/UPDATE ✓

```typescript
// src/screens/Profile.tsx (linha 130)
const { error } = await supabase
  .from('profiles')
  .upsert(supabaseProfileData, { onConflict: 'user_id' });
```

### ❌ **Completed Workouts (NÃO FUNCIONA)**
- RLS não configurado ✗
- Sem políticas ✗
- Código não tenta salvar ✗

## Solução Necessária

### Etapa 1: Criar Migration com RLS
Criar arquivo: `supabase/migrations/20251113_fix_completed_workouts_rls.sql`

### Etapa 2: Modificar código do Workout.tsx
Adicionar lógica de salvamento no Supabase após AsyncStorage

### Etapa 3: Adicionar sincronização
Implementar sync bidirecional (local ↔ Supabase)

### Etapa 4: Ajustar schema
Corrigir campo `exerciseName` → `exercise` ou vice-versa

## Arquivos para Modificar

1. ✏️ Nova migration SQL (criar RLS)
2. ✏️ `src/screens/Workout.tsx` (adicionar INSERT no Supabase)
3. ✏️ `src/screens/Progress.tsx` (melhorar sync)
4. ✏️ `src/screens/History.tsx` (melhorar sync)

## Prioridade

🔴 **ALTA** - Este é um bug crítico que impede o uso adequado do app em produção.

## Próximos Passos

1. Criar migration para habilitar RLS e políticas
2. Modificar `Workout.tsx` para salvar no Supabase
3. Testar salvamento com usuário autenticado
4. Implementar sincronização completa
5. Adicionar tratamento de erros robusto
