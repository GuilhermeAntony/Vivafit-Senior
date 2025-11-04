// Script para testar conexão com múltiplos schemas no Supabase
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://misptjgsftdtqfvqsneq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3B0amdzZnRkdHFmdnFzbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjgyODEsImV4cCI6MjA3Mjk0NDI4MX0.LkjTMPYMUmeWBSyemdl2WbPyA42hx_9FXYH0r5zhnoA';

console.log('🔧 Testando múltiplos schemas no Supabase...\n');

async function testSchema(schemaName) {
  console.log(`\n📦 Testando schema: ${schemaName}`);
  console.log('='.repeat(50));
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: {
      schema: schemaName
    }
  });

  try {
    // Testar tabela exercises
    console.log(`\n1️⃣ Testando ${schemaName}.exercises...`);
    const { data, error, count } = await supabase
      .from('exercises')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log(`  ❌ Erro:`, error.message);
      console.log(`  Código:`, error.code);
    } else {
      console.log(`  ✅ Sucesso! ${count || data?.length || 0} registros encontrados`);
      if (data && data.length > 0) {
        console.log(`  📝 Primeiro exercício:`, data[0].name);
      }
    }

    // Testar tabela profiles
    console.log(`\n2️⃣ Testando ${schemaName}.profiles...`);
    const { data: profilesData, error: profilesError, count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    if (profilesError) {
      console.log(`  ❌ Erro:`, profilesError.message);
      console.log(`  Código:`, profilesError.code);
    } else {
      console.log(`  ✅ Sucesso! ${profilesCount || profilesData?.length || 0} registros encontrados`);
    }

    // Testar tabela workouts
    console.log(`\n3️⃣ Testando ${schemaName}.workouts...`);
    const { data: workoutsData, error: workoutsError, count: workoutsCount } = await supabase
      .from('workouts')
      .select('*', { count: 'exact' });
    
    if (workoutsError) {
      console.log(`  ❌ Erro:`, workoutsError.message);
      console.log(`  Código:`, workoutsError.code);
    } else {
      console.log(`  ✅ Sucesso! ${workoutsCount || workoutsData?.length || 0} registros encontrados`);
    }

  } catch (e) {
    console.log(`  ❌ Erro geral:`, e.message);
  }
}

async function main() {
  // Testar schema 'api'
  await testSchema('api');
  
  // Testar schema 'public'
  await testSchema('public');
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Teste concluído!\n');
  console.log('💡 Se o schema "public" retornou erro PGRST106,');
  console.log('   você precisa configurá-lo no Supabase Dashboard:');
  console.log('   Settings → API → Exposed schemas → "public,api"\n');
}

main().catch(console.error);
