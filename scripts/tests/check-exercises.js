// Script para verificar exercícios diretamente no banco
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://misptjgsftdtqfvqsneq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3B0amdzZnRkdHFmdnFzbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjgyODEsImV4cCI6MjA3Mjk0NDI4MX0.LkjTMPYMUmeWBSyemdl2WbPyA42hx_9FXYH0r5zhnoA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public'
  }
});

async function checkExercises() {
  console.log('🔍 Verificando exercícios no banco de dados...\n');

  try {
    // Teste 1: Contar total de exercícios
    console.log('1️⃣ Contando exercícios...');
    const { count, error: countError } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('  ❌ Erro ao contar:', countError.message);
      console.log('  Código:', countError.code);
    } else {
      console.log(`  ✅ Total de exercícios: ${count}`);
    }

    // Teste 2: Listar exercícios (sem RLS)
    console.log('\n2️⃣ Listando exercícios...');
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, category, duration, is_active');

    if (error) {
      console.log('  ❌ Erro ao listar:', error.message);
      console.log('  Código:', error.code);
      console.log('  Detalhes:', error.details);
      console.log('  Hint:', error.hint);
    } else if (!data || data.length === 0) {
      console.log('  ⚠️  Nenhum exercício encontrado!');
      console.log('  Isso pode significar:');
      console.log('     1. Os exercícios não foram inseridos');
      console.log('     2. RLS está bloqueando a leitura');
      console.log('     3. Exercícios estão em outro schema');
    } else {
      console.log(`  ✅ ${data.length} exercícios encontrados:\n`);
      data.forEach((ex, i) => {
        console.log(`     ${i + 1}. ${ex.name} (${ex.category}) - ${ex.duration}s - Ativo: ${ex.is_active}`);
      });
    }

    // Teste 3: Verificar RLS
    console.log('\n3️⃣ Verificando políticas RLS...');
    const { data: rlsData, error: rlsError } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    if (rlsError) {
      console.log('  ❌ RLS pode estar bloqueando:', rlsError.message);
    } else {
      console.log(`  ✅ RLS permite leitura: ${rlsData?.length || 0} registros acessíveis`);
    }

    // Teste 4: Verificar se é problema de autenticação
    console.log('\n4️⃣ Testando com autenticação...');
    const { data: authSession } = await supabase.auth.getSession();
    
    if (!authSession.session) {
      console.log('  ⚠️  Não há usuário autenticado');
      console.log('  A política RLS pode exigir autenticação para ler exercícios');
      console.log('  Verifique a política: "Anyone can view active exercises"');
    } else {
      console.log('  ✅ Usuário autenticado:', authSession.session.user.email);
    }

  } catch (e) {
    console.log('\n❌ Erro geral:', e.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('💡 DIAGNÓSTICO:');
  console.log('='.repeat(60));
  console.log('');
  console.log('Se os exercícios não aparecem, execute este SQL no Supabase:');
  console.log('');
  console.log('-- Verificar se exercícios existem');
  console.log('SELECT COUNT(*) FROM public.exercises;');
  console.log('');
  console.log('-- Listar exercícios');
  console.log('SELECT name, category FROM public.exercises LIMIT 5;');
  console.log('');
  console.log('-- Verificar RLS');
  console.log('SELECT tablename, policyname, roles, cmd, qual');
  console.log('FROM pg_policies');
  console.log('WHERE schemaname = \'public\' AND tablename = \'exercises\';');
  console.log('');
}

checkExercises();
