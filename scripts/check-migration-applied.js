#!/usr/bin/env node

/**
 * Verifica se a migration 20251113_fix_completed_workouts_rls.sql foi aplicada
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

async function main() {
  console.log('\n' + '='.repeat(70));
  log('🔍', 'Verificação de Migration - completed_workouts', colors.cyan);
  console.log('='.repeat(70) + '\n');

  // Carregar config
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const supabaseUrl = appJson?.expo?.extra?.supabase?.url;
  const supabaseAnonKey = appJson?.expo?.extra?.supabase?.anonKey;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  log('📋', 'Verificando estrutura da tabela completed_workouts...', colors.cyan);
  console.log('');

  try {
    // Tentar fazer um SELECT para pegar a estrutura
    const { data, error } = await supabase
      .from('completed_workouts')
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      log('❌', 'Tabela completed_workouts NÃO EXISTE!', colors.red);
      console.log('');
      console.log('  Execute a migration de criação primeiro:');
      console.log('  supabase/migrations/20250919_create_completed_workouts.sql');
      console.log('');
      process.exit(1);
    }

    log('✅', 'Tabela completed_workouts existe', colors.green);
    console.log('');

    // Verificar se a coluna exercise_name existe
    log('📋', 'Verificando coluna exercise_name...', colors.cyan);
    
    const { data: testData, error: testError } = await supabase
      .from('completed_workouts')
      .select('exercise_name')
      .limit(0);

    if (testError) {
      if (testError.message.includes('exercise_name')) {
        log('❌', 'Coluna exercise_name NÃO EXISTE!', colors.red);
        console.log('');
        log('⚠️', 'A migration 20251113_fix_completed_workouts_rls.sql NÃO foi aplicada!', colors.yellow);
        console.log('');
        console.log('  📋 Para aplicar a migration:');
        console.log('');
        console.log('  1. Acesse: https://app.supabase.com');
        console.log('  2. Vá em SQL Editor');
        console.log('  3. Copie e execute o conteúdo de:');
        console.log('     supabase/migrations/20251113_fix_completed_workouts_rls.sql');
        console.log('');
        process.exit(1);
      } else {
        throw testError;
      }
    }

    log('✅', 'Coluna exercise_name existe!', colors.green);
    console.log('');

    // Verificar RLS
    log('📋', 'Testando RLS (Row Level Security)...', colors.cyan);
    
    const { error: rlsError } = await supabase
      .from('completed_workouts')
      .insert({
        date: '2025-11-13',
        steps: 1,
        exercise: 'TESTE'
      });

    if (rlsError) {
      if (rlsError.code === '42501' || rlsError.message.includes('policy')) {
        log('✅', 'RLS está ATIVO! (INSERT bloqueado sem autenticação)', colors.green);
      } else {
        log('⚠️', `Erro inesperado: ${rlsError.message}`, colors.yellow);
      }
    } else {
      log('❌', 'RLS NÃO está ativo! (INSERT sem auth funcionou)', colors.red);
      log('⚠️', 'Isso é um problema de segurança!', colors.yellow);
      console.log('');
      console.log('  Execute a migration para habilitar RLS:');
      console.log('  supabase/migrations/20251113_fix_completed_workouts_rls.sql');
      console.log('');
    }

    console.log('');
    console.log('='.repeat(70));
    log('📊', 'RESULTADO DA VERIFICAÇÃO', colors.cyan);
    console.log('='.repeat(70));
    console.log('');

    // Resumo
    const checks = [
      { name: 'Tabela completed_workouts existe', status: true },
      { name: 'Coluna exercise_name existe', status: true },
      { name: 'RLS está ativo', status: rlsError ? true : false }
    ];

    checks.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      const color = check.status ? colors.green : colors.red;
      log(icon, check.name, color);
    });

    console.log('');

    const allOk = checks.every(c => c.status);

    if (allOk) {
      log('🎉', 'MIGRATION FOI APLICADA CORRETAMENTE!', colors.green);
      console.log('');
      console.log('  O banco está configurado e pronto para uso.');
      console.log('  Agora você pode:');
      console.log('');
      console.log('  1. Iniciar o app: npx expo start');
      console.log('  2. Fazer login');
      console.log('  3. Completar um treino');
      console.log('  4. Verificar se foi salvo: node scripts/check-supabase-data.js');
      console.log('');
    } else {
      log('⚠️', 'MIGRATION NÃO FOI APLICADA COMPLETAMENTE!', colors.yellow);
      console.log('');
      console.log('  Execute a migration no Supabase Dashboard.');
      console.log('');
    }

  } catch (error) {
    log('❌', `Erro: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  }

  console.log('='.repeat(70));
  console.log('');
}

main();
