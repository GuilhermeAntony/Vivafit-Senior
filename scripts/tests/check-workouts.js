// Script para verificar tabela workouts
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://misptjgsftdtqfvqsneq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3B0amdzZnRkdHFmdnFzbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjgyODEsImV4cCI6MjA3Mjk0NDI4MX0.LkjTMPYMUmeWBSyemdl2WbPyA42hx_9FXYH0r5zhnoA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public'
  }
});

async function checkWorkouts() {
  console.log('🔍 Verificando tabela workouts...\n');

  try {
    // Teste 1: Contar workouts
    console.log('1️⃣ Tentando contar workouts...');
    const { count, error: countError } = await supabase
      .from('workouts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('  ❌ Erro ao contar:', countError.message);
      console.log('  Código:', countError.code);
      console.log('  Detalhes:', countError.details);
    } else {
      console.log(`  ✅ Total de workouts: ${count}`);
    }

    // Teste 2: Listar workouts
    console.log('\n2️⃣ Tentando listar workouts...');
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .limit(5);

    if (error) {
      console.log('  ❌ Erro ao listar:', error.message);
      console.log('  Código:', error.code);
      
      if (error.code === 'PGRST205') {
        console.log('\n  ⚠️  TABELA NÃO ENCONTRADA NO SCHEMA CACHE');
        console.log('  Possíveis causas:');
        console.log('     1. Tabela não foi criada');
        console.log('     2. Tabela está em outro schema');
        console.log('     3. Schema cache precisa ser atualizado');
      } else if (error.code === '42501') {
        console.log('\n  ⚠️  BLOQUEADO POR RLS');
        console.log('  A política de segurança está impedindo o acesso');
      }
    } else {
      console.log(`  ✅ ${data?.length || 0} workouts encontrados`);
      if (data && data.length > 0) {
        data.forEach((w, i) => {
          console.log(`     ${i + 1}. ${w.name || 'Sem nome'} - User: ${w.user_id}`);
        });
      }
    }

    // Teste 3: Verificar outras tabelas relacionadas
    console.log('\n3️⃣ Verificando tabelas relacionadas...');
    
    const relatedTables = [
      'workout_exercises',
      'user_progress',
      'profiles'
    ];

    for (const table of relatedTables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: ${error.code} - ${error.message}`);
      } else {
        console.log(`  ✅ ${table}: ${count} registros`);
      }
    }

  } catch (e) {
    console.log('\n❌ Erro geral:', e.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('💡 SOLUÇÕES:');
  console.log('='.repeat(60));
  console.log('\nSe a tabela NÃO FOI ENCONTRADA (PGRST205):');
  console.log('Execute no Supabase SQL Editor:');
  console.log('');
  console.log('-- Verificar se a tabela existe');
  console.log('SELECT tablename FROM pg_tables');
  console.log('WHERE schemaname = \'public\' AND tablename = \'workouts\';');
  console.log('');
  console.log('-- Se não existir, execute a migração completa:');
  console.log('-- supabase/migrations/20250117_vivafit_seniors_SAFE.sql');
  console.log('');
  console.log('\nSe estiver BLOQUEADA POR RLS (42501):');
  console.log('Execute no Supabase SQL Editor:');
  console.log('');
  console.log('-- Permitir leitura de workouts do próprio usuário');
  console.log('DROP POLICY IF EXISTS "Users can view their own workouts" ON public.workouts;');
  console.log('CREATE POLICY "Users can view their own workouts"');
  console.log('ON public.workouts');
  console.log('FOR SELECT');
  console.log('TO authenticated');
  console.log('USING (user_id = auth.uid());');
  console.log('');
  console.log('-- OU temporariamente desabilitar RLS para testar:');
  console.log('ALTER TABLE public.workouts DISABLE ROW LEVEL SECURITY;');
  console.log('');
}

checkWorkouts();
