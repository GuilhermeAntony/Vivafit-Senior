// Script para testar conexão com Supabase
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://misptjgsftdtqfvqsneq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3B0amdzZnRkdHFmdnFzbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjgyODEsImV4cCI6MjA3Mjk0NDI4MX0.LkjTMPYMUmeWBSyemdl2WbPyA42hx_9FXYH0r5zhnoA';

console.log('🔧 Testando conexão com Supabase...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key (primeiros 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public' // Schema configurado
  }
});

async function testConnection() {
  try {
    console.log('1️⃣ Testando autenticação anônima...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️ Aviso de auth:', authError.message);
    } else {
      console.log('✅ Auth OK - Session:', authData.session ? 'Existente' : 'Nenhuma');
    }

    console.log('\n2️⃣ Tentando listar tabelas comuns...');
    
    const tablesToTest = ['profiles', 'exercises', 'workouts', 'user_progress', 'user_achievements'];
    
    for (const table of tablesToTest) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false });

      if (error) {
        console.log(`  ❌ ${table}:`, error.code, '-', error.message);
      } else {
        const totalRecords = count !== null ? count : (data?.length || 0);
        console.log(`  ✅ ${table}: Tabela existe! Registros: ${totalRecords}`);
      }
    }

    console.log('\n3️⃣ Testando inserção em profiles...');
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: '123-test',
        display_name: 'Teste',
        age: 65
      })
      .select();

    if (insertError) {
      console.log('  ❌ Erro ao inserir:', insertError.message);
      console.log('  Código:', insertError.code);
      console.log('  Detalhes:', insertError.details);
    } else {
      console.log('  ✅ Inserção bem-sucedida:', insertData);
    }

  } catch (e) {
    console.log('❌ Erro geral:', e.message);
    console.log('Stack:', e.stack);
  }
}

testConnection();
