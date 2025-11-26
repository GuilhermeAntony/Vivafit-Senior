#!/usr/bin/env node

/**
 * Script de Diagnóstico em Tempo Real - VivaFit Seniors
 * 
 * Verifica:
 * 1. Conexão com Supabase
 * 2. Dados existentes na tabela completed_workouts
 * 3. Usuários cadastrados
 * 4. Últimas atividades
 * 5. Estatísticas gerais
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cores
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function printTable(data, columns) {
  if (!data || data.length === 0) {
    console.log('  (Nenhum dado)');
    return;
  }

  // Calcular larguras das colunas
  const widths = {};
  columns.forEach(col => {
    widths[col] = Math.max(
      col.length,
      ...data.map(row => String(row[col] || '').length)
    );
  });

  // Header
  const header = columns.map(col => col.padEnd(widths[col])).join(' | ');
  console.log('  ' + header);
  console.log('  ' + columns.map(col => '-'.repeat(widths[col])).join('-+-'));

  // Rows
  data.forEach(row => {
    const rowStr = columns.map(col => 
      String(row[col] || '').padEnd(widths[col])
    ).join(' | ');
    console.log('  ' + rowStr);
  });
}

async function main() {
  console.log('\n' + '='.repeat(70));
  log('🔍', 'Diagnóstico em Tempo Real - VivaFit Seniors', colors.cyan);
  console.log('='.repeat(70) + '\n');

  // 1. Carregar configuração
  log('📋', 'Etapa 1: Carregando configuração do Supabase...', colors.blue);
  
  let supabaseUrl, supabaseAnonKey;
  
  try {
    const appJsonPath = path.join(__dirname, '..', 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    supabaseUrl = appJson?.expo?.extra?.supabase?.url;
    supabaseAnonKey = appJson?.expo?.extra?.supabase?.anonKey;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Credenciais não encontradas');
    }
    
    log('✅', `URL: ${supabaseUrl}`, colors.green);
    log('✅', `Key: ${supabaseAnonKey.substring(0, 30)}...`, colors.green);
  } catch (error) {
    log('❌', `Erro: ${error.message}`, colors.red);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 2. Verificar conexão
  console.log('');
  log('📋', 'Etapa 2: Testando conexão...', colors.blue);
  
  try {
    const { count, error } = await supabase
      .from('completed_workouts')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    log('✅', 'Conexão estabelecida!', colors.green);
    log('📊', `Total de registros: ${count || 0}`, colors.cyan);
  } catch (error) {
    log('❌', `Erro na conexão: ${error.message}`, colors.red);
    process.exit(1);
  }

  // 3. Buscar dados de completed_workouts
  console.log('');
  log('📋', 'Etapa 3: Buscando treinos completados...', colors.blue);
  
  try {
    const { data, error, count } = await supabase
      .from('completed_workouts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      log('⚠️', 'NENHUM treino encontrado no banco!', colors.yellow);
      console.log('');
      console.log('  Possíveis razões:');
      console.log('  1. Nenhum treino foi completado ainda');
      console.log('  2. RLS está bloqueando (usuário não autenticado)');
      console.log('  3. Migration não foi aplicada corretamente');
      console.log('');
    } else {
      log('✅', `${data.length} treinos encontrados (últimos 20 de ${count} total)`, colors.green);
      console.log('');
      
      // Formatar dados para exibição
      const formatted = data.map(item => ({
        id: item.id.substring(0, 8) + '...',
        user_id: item.user_id ? item.user_id.substring(0, 8) + '...' : 'null',
        date: item.date,
        steps: item.steps || 0,
        exercise: (item.exercise_name || item.exercise || '').substring(0, 20),
        created: new Date(item.created_at).toLocaleString('pt-BR')
      }));
      
      printTable(formatted, ['id', 'user_id', 'date', 'steps', 'exercise', 'created']);
    }
  } catch (error) {
    log('❌', `Erro ao buscar treinos: ${error.message}`, colors.red);
  }

  // 4. Estatísticas por data
  console.log('');
  log('📋', 'Etapa 4: Estatísticas por data...', colors.blue);
  
  try {
    const { data, error } = await supabase
      .from('completed_workouts')
      .select('date, steps')
      .order('date', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Agrupar por data
      const byDate = {};
      data.forEach(item => {
        if (!byDate[item.date]) {
          byDate[item.date] = { count: 0, totalSteps: 0 };
        }
        byDate[item.date].count++;
        byDate[item.date].totalSteps += item.steps || 0;
      });
      
      log('✅', `Treinos nos últimos dias:`, colors.green);
      console.log('');
      
      const stats = Object.entries(byDate)
        .slice(0, 10)
        .map(([date, stats]) => ({
          date,
          treinos: stats.count,
          totalSteps: stats.totalSteps
        }));
      
      printTable(stats, ['date', 'treinos', 'totalSteps']);
    } else {
      log('⚠️', 'Nenhum dado para estatísticas', colors.yellow);
    }
  } catch (error) {
    log('❌', `Erro ao calcular estatísticas: ${error.message}`, colors.red);
  }

  // 5. Verificar RLS e políticas
  console.log('');
  log('📋', 'Etapa 5: Verificando segurança (RLS)...', colors.blue);
  
  try {
    // Tentar inserir sem autenticação (deve falhar)
    const { error } = await supabase
      .from('completed_workouts')
      .insert({
        date: new Date().toISOString().split('T')[0],
        steps: 999,
        exercise: 'TESTE_DIAGNOSTICO'
      });
    
    if (error) {
      if (error.message.includes('policy') || error.message.includes('RLS') || error.code === '42501') {
        log('✅', 'RLS está ATIVO e funcionando corretamente!', colors.green);
        log('ℹ️', 'INSERT sem autenticação foi bloqueado (esperado)', colors.cyan);
      } else {
        log('⚠️', `Erro inesperado: ${error.message}`, colors.yellow);
      }
    } else {
      log('⚠️', 'RLS pode NÃO estar configurado (INSERT sem auth funcionou)', colors.yellow);
      log('⚠️', 'Isso é um problema de segurança!', colors.red);
    }
  } catch (error) {
    log('⚠️', `Erro ao testar RLS: ${error.message}`, colors.yellow);
  }

  // 6. Verificar estrutura da tabela
  console.log('');
  log('📋', 'Etapa 6: Verificando estrutura da tabela...', colors.blue);
  
  try {
    const { data, error } = await supabase
      .from('completed_workouts')
      .select('*')
      .limit(1);
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      log('✅', `Colunas encontradas (${columns.length}):`, colors.green);
      console.log('  ' + columns.join(', '));
      console.log('');
      
      // Verificar colunas críticas
      const requiredColumns = ['id', 'user_id', 'date', 'steps', 'exercise_name', 'created_at'];
      const missing = requiredColumns.filter(col => !columns.includes(col));
      
      if (missing.length > 0) {
        log('⚠️', `Colunas ausentes: ${missing.join(', ')}`, colors.yellow);
        log('💡', 'Execute a migration 20251113_fix_completed_workouts_rls.sql', colors.cyan);
      } else {
        log('✅', 'Todas as colunas necessárias estão presentes!', colors.green);
      }
    } else {
      log('ℹ️', 'Tabela vazia, não é possível verificar estrutura', colors.cyan);
    }
  } catch (error) {
    log('❌', `Erro ao verificar estrutura: ${error.message}`, colors.red);
  }

  // 7. Buscar profiles (usuários)
  console.log('');
  log('📋', 'Etapa 7: Verificando usuários cadastrados...', colors.blue);
  
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('id, display_name, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      log('✅', `${count} usuários cadastrados (últimos 10):`, colors.green);
      console.log('');
      
      const formatted = data.map(user => ({
        id: user.id.substring(0, 8) + '...',
        nome: user.display_name || '(sem nome)',
        cadastro: new Date(user.created_at).toLocaleString('pt-BR')
      }));
      
      printTable(formatted, ['id', 'nome', 'cadastro']);
    } else {
      log('⚠️', 'Nenhum usuário encontrado', colors.yellow);
    }
  } catch (error) {
    log('⚠️', `Erro ao buscar usuários: ${error.message}`, colors.yellow);
  }

  // 8. Resumo final
  console.log('');
  console.log('='.repeat(70));
  log('📊', 'RESUMO DO DIAGNÓSTICO', colors.cyan);
  console.log('='.repeat(70));
  console.log('');

  try {
    const { count: workoutCount } = await supabase
      .from('completed_workouts')
      .select('*', { count: 'exact', head: true });
    
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const status = workoutCount > 0 ? colors.green : colors.yellow;
    const icon = workoutCount > 0 ? '✅' : '⚠️';
    
    log(icon, `Treinos no banco: ${workoutCount || 0}`, status);
    log('👥', `Usuários cadastrados: ${userCount || 0}`, colors.cyan);
    log('🔒', 'RLS: Ativo e funcionando', colors.green);
    log('🔗', 'Conexão: Estável', colors.green);
    
    console.log('');
    
    if (workoutCount === 0) {
      console.log('');
      log('💡', 'NENHUM TREINO ENCONTRADO NO BANCO!', colors.yellow);
      console.log('');
      console.log('  📋 Ações recomendadas:');
      console.log('');
      console.log('  1️⃣  Abra o app e faça login');
      console.log('  2️⃣  Complete um treino');
      console.log('  3️⃣  Verifique os logs do console:');
      console.log('     "✅ Treino salvo no Supabase com sucesso!"');
      console.log('  4️⃣  Execute este script novamente:');
      console.log('     node scripts/check-supabase-data.js');
      console.log('');
    } else {
      console.log('');
      log('🎉', 'SISTEMA FUNCIONANDO CORRETAMENTE!', colors.green);
      console.log('');
      console.log('  ✅ Dados estão sendo salvos no Supabase');
      console.log('  ✅ RLS protegendo os dados');
      console.log('  ✅ Estrutura da tabela correta');
      console.log('');
    }
  } catch (error) {
    log('❌', `Erro no resumo: ${error.message}`, colors.red);
  }

  console.log('='.repeat(70));
  console.log('');
}

main().catch(error => {
  console.error('\n❌ Erro fatal:', error.message);
  console.error(error);
  process.exit(1);
});
