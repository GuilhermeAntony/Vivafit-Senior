#!/bin/bash

# Script para verificar status do app VivaFit Seniors

echo "🏋️ VivaFit Seniors - Verificação de Status"
echo "=========================================="
echo ""

# Função para mostrar status
check_status() {
  local name="$1"
  local status="$2"
  
  if [ "$status" = "ok" ]; then
    echo "✅ $name"
  elif [ "$status" = "warning" ]; then
    echo "⚠️  $name"
  else
    echo "❌ $name"
  fi
}

echo "📦 1. Testando conexão com Supabase..."
node test-supabase.js > /tmp/supabase-test.log 2>&1

# Verificar se exercises tem dados
if grep -q "exercises: Tabela existe! Registros: [1-9]" /tmp/supabase-test.log || \
   grep -q "exercises: Tabela existe! Registros: 10" /tmp/supabase-test.log; then
  # Extrair número de registros
  EXERCISE_COUNT=$(grep "exercises: Tabela existe! Registros:" /tmp/supabase-test.log | grep -o '[0-9]\+' | tail -1)
  check_status "Exercícios no banco de dados ($EXERCISE_COUNT registros)" "ok"
  EXERCISES_OK=true
elif grep -q "exercises: Tabela existe! Registros: 0" /tmp/supabase-test.log; then
  check_status "Exercícios no banco de dados (VAZIO!)" "error"
  EXERCISES_OK=false
else
  check_status "Tabela exercises" "error"
  EXERCISES_OK=false
fi

# Verificar se profiles existe
if grep -q "profiles: Tabela existe!" /tmp/supabase-test.log; then
  check_status "Tabela profiles" "ok"
else
  check_status "Tabela profiles" "error"
fi

# Verificar se workouts existe
if grep -q "workouts.*Tabela existe!" /tmp/supabase-test.log; then
  check_status "Tabela workouts" "ok"
elif grep -q "workouts.*PGRST" /tmp/supabase-test.log; then
  check_status "Tabela workouts (não encontrada)" "error"
else
  check_status "Tabela workouts" "ok"
fi

echo ""
echo "🔧 2. Verificando configuração do código..."

# Verificar schema configurado
if grep -q "schema: 'public'" src/lib/supabase.ts; then
  check_status "Schema configurado como 'public'" "ok"
elif grep -q "schema: 'api'" src/lib/supabase.ts; then
  check_status "Schema configurado como 'api'" "warning"
else
  check_status "Schema configuration" "error"
fi

# Verificar credenciais
if grep -q "misptjgsftdtqfvqsneq.supabase.co" app.json; then
  check_status "Credenciais Supabase configuradas" "ok"
else
  check_status "Credenciais Supabase" "error"
fi

echo ""
echo "📱 3. Verificando arquivos do projeto..."

# Verificar arquivos críticos
[ -f "src/screens/Exercises.tsx" ] && check_status "Tela de Exercícios" "ok" || check_status "Tela de Exercícios" "error"
[ -f "src/screens/Login.tsx" ] && check_status "Tela de Login" "ok" || check_status "Tela de Login" "error"
[ -f "src/screens/Home.tsx" ] && check_status "Tela Home" "ok" || check_status "Tela Home" "error"
[ -f "src/lib/exerciseCache.ts" ] && check_status "Sistema de Cache" "ok" || check_status "Sistema de Cache" "error"

echo ""
echo "=========================================="
echo ""

if [ "$EXERCISES_OK" = true ]; then
  echo "🎉 STATUS: PRONTO PARA TESTAR!"
  echo ""
  echo "📱 Próximos passos:"
  echo "   1. npm start"
  echo "   2. Pressione 'a' para Android ou 'i' para iOS"
  echo "   3. Teste o fluxo de autenticação"
  echo "   4. Verifique se os exercícios aparecem"
  echo ""
else
  echo "⚠️  STATUS: AÇÃO NECESSÁRIA!"
  echo ""
  echo "❌ Exercícios não encontrados no banco de dados"
  echo ""
  echo "📝 Para resolver:"
  echo "   1. Acesse: https://supabase.com/dashboard/project/misptjgsftdtqfvqsneq/sql"
  echo "   2. Execute o SQL em: supabase/migrations/insert_sample_exercises.sql"
  echo "   3. Execute novamente: ./check-status.sh"
  echo ""
fi

# Limpar arquivo temporário
rm -f /tmp/supabase-test.log
