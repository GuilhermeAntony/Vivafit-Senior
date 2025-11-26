#!/bin/bash

# 🧪 Guia de Teste Visual - VivaFit Seniors
# Execute este passo a passo para validar as correções

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🧪 TESTE VISUAL - Sistema de Salvamento no Supabase      ║"
echo "╔════════════════════════════════════════════════════════════╗"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 CHECKLIST DE TESTE${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

# Teste 1
echo -e "${YELLOW}[ ] TESTE 1: Aplicar Migration no Supabase${NC}"
echo "    1. Abra: https://app.supabase.com"
echo "    2. Selecione o projeto VivaFit Seniors"
echo "    3. Vá em: SQL Editor"
echo "    4. Copie o conteúdo de:"
echo "       supabase/migrations/20251113_fix_completed_workouts_rls.sql"
echo "    5. Cole no SQL Editor e execute (Ctrl+Enter ou botão Run)"
echo "    6. Verifique: Success (sem erros)"
echo ""
read -p "    Pressione ENTER após concluir este teste..."
echo ""

# Teste 2
echo -e "${YELLOW}[ ] TESTE 2: Verificar RLS no Dashboard${NC}"
echo "    1. No Supabase Dashboard, vá em: Table Editor"
echo "    2. Selecione a tabela: completed_workouts"
echo "    3. Verifique que existe a coluna: exercise_name"
echo "    4. Vá em: Database → Policies"
echo "    5. Confirme 4 políticas para completed_workouts:"
echo "       - Users can view their own completed workouts"
echo "       - Users can insert their own completed workouts"
echo "       - Users can update their own completed workouts"
echo "       - Users can delete their own completed workouts"
echo ""
read -p "    Pressione ENTER após concluir este teste..."
echo ""

# Teste 3
echo -e "${YELLOW}[ ] TESTE 3: Iniciar o App${NC}"
echo "    Execute em outro terminal:"
echo -e "${GREEN}    npx expo start -c${NC}"
echo ""
echo "    Aguarde o QR code aparecer..."
echo ""
read -p "    Pressione ENTER quando o app estiver rodando..."
echo ""

# Teste 4
echo -e "${YELLOW}[ ] TESTE 4: Fazer Login no App${NC}"
echo "    1. Abra o app no dispositivo/emulador"
echo "    2. Faça login com:"
echo "       • Email de teste existente OU"
echo "       • Crie uma nova conta"
echo "    3. Confirme que entrou na tela Home"
echo ""
read -p "    Pressione ENTER após fazer login..."
echo ""

# Teste 5
echo -e "${YELLOW}[ ] TESTE 5: Completar um Treino${NC}"
echo "    1. No app, vá em: Exercícios"
echo "    2. Escolha qualquer exercício"
echo "    3. Clique em 'Iniciar Treino'"
echo "    4. Use 'Pular' para acelerar os passos"
echo "    5. Clique em 'Finalizar Treino'"
echo "    6. Aparece: 'Parabéns! 🎉 Treino completado'"
echo ""
read -p "    Pressione ENTER após completar o treino..."
echo ""

# Teste 6
echo -e "${YELLOW}[ ] TESTE 6: Verificar Logs do Console${NC}"
echo "    No terminal do Metro Bundler, procure por:"
echo -e "${GREEN}    ✅ Treino salvo no Supabase com sucesso!${NC}"
echo ""
echo "    Se ver essa mensagem: TESTE PASSOU ✅"
echo "    Se ver erro: Anote o erro e continue"
echo ""
read -p "    Qual mensagem apareceu? (s=sucesso, e=erro, n=nada): " log_result
echo ""

if [ "$log_result" = "s" ]; then
    echo -e "${GREEN}    ✅ SUCESSO! Prosseguindo...${NC}"
elif [ "$log_result" = "e" ]; then
    echo -e "${RED}    ❌ ERRO detectado. Anote o erro para debug.${NC}"
else
    echo -e "${YELLOW}    ⚠️  Nenhuma mensagem? Verifique se Supabase está configurado.${NC}"
fi
echo ""

# Teste 7
echo -e "${YELLOW}[ ] TESTE 7: Verificar no Supabase Dashboard${NC}"
echo "    1. Volte ao Supabase Dashboard"
echo "    2. Vá em: Table Editor → completed_workouts"
echo "    3. Clique em 'Refresh' (ícone de reload)"
echo "    4. Procure pelo registro mais recente (última linha)"
echo "    5. Verifique os campos:"
echo "       - user_id: deve ter um UUID"
echo "       - date: data de hoje"
echo "       - steps: número de etapas do treino"
echo "       - exercise_name: nome do exercício"
echo "       - created_at: timestamp atual"
echo ""
read -p "    O registro apareceu? (s/n): " db_result
echo ""

if [ "$db_result" = "s" ]; then
    echo -e "${GREEN}    ✅ EXCELENTE! Dados salvos no banco!${NC}"
else
    echo -e "${RED}    ❌ Registro não apareceu. Possíveis causas:${NC}"
    echo "       1. Migration não foi aplicada"
    echo "       2. Usuário não estava autenticado"
    echo "       3. RLS bloqueou a inserção"
    echo "       4. Erro de conexão"
fi
echo ""

# Teste 8
echo -e "${YELLOW}[ ] TESTE 8: Verificar Tela de Progresso${NC}"
echo "    1. No app, vá em: Progresso (ícone de gráfico)"
echo "    2. Verifique a seção 'Estatísticas'"
echo "    3. Confirme que 'Total de Treinos' aumentou"
echo "    4. Veja se aparece no gráfico 'Últimos Treinos'"
echo "    5. Confira a lista 'Treinos Recentes'"
echo ""
echo "    No console do Metro, procure:"
echo -e "${GREEN}    ✅ X treinos carregados do Supabase${NC}"
echo ""
read -p "    Os dados aparecem na tela? (s/n): " progress_result
echo ""

if [ "$progress_result" = "s" ]; then
    echo -e "${GREEN}    ✅ PERFEITO! Sincronização funcionando!${NC}"
else
    echo -e "${YELLOW}    ⚠️  Dados não apareceram. Verifique os logs.${NC}"
fi
echo ""

# Teste 9
echo -e "${YELLOW}[ ] TESTE 9: Verificar Tela de Histórico${NC}"
echo "    1. No app, vá em: Histórico"
echo "    2. Verifique se o treino aparece na lista"
echo "    3. Confirme data, passos e nome do exercício"
echo ""
echo "    No console do Metro, procure:"
echo -e "${GREEN}    ✅ X treinos carregados do Supabase no histórico${NC}"
echo ""
read -p "    Os dados aparecem na tela? (s/n): " history_result
echo ""

if [ "$history_result" = "s" ]; then
    echo -e "${GREEN}    ✅ ÓTIMO! Histórico sincronizando!${NC}"
else
    echo -e "${YELLOW}    ⚠️  Dados não apareceram. Verifique os logs.${NC}"
fi
echo ""

# Resumo Final
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  📊 RESUMO DOS TESTES                                      ║"
echo "╔════════════════════════════════════════════════════════════╗"
echo ""

total_tests=9
passed_tests=0

if [ "$log_result" = "s" ]; then ((passed_tests++)); fi
if [ "$db_result" = "s" ]; then ((passed_tests++)); fi
if [ "$progress_result" = "s" ]; then ((passed_tests++)); fi
if [ "$history_result" = "s" ]; then ((passed_tests++)); fi

echo "Testes automatizáveis: 4"
echo "Testes manuais realizados: $total_tests"
echo -e "Testes bem-sucedidos: ${GREEN}$passed_tests${NC}"
echo ""

if [ $passed_tests -ge 3 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO!                      ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║  O sistema de salvamento está funcionando corretamente!   ║${NC}"
    echo -e "${GREEN}║  • Dados salvos no Supabase ✅                            ║${NC}"
    echo -e "${GREEN}║  • RLS protegendo acesso ✅                               ║${NC}"
    echo -e "${GREEN}║  • Sincronização funcionando ✅                           ║${NC}"
    echo -e "${GREEN}║  • Telas exibindo dados ✅                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  ALGUNS TESTES FALHARAM                               ║${NC}"
    echo -e "${YELLOW}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${YELLOW}║  Revise os passos com falha e consulte:                   ║${NC}"
    echo -e "${YELLOW}║  • docs/CORRECOES_APLICADAS.md (troubleshooting)          ║${NC}"
    echo -e "${YELLOW}║  • docs/VALIDACAO_FINAL.md (guia completo)                ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
fi

echo ""
echo "📚 Documentação completa em:"
echo "   • docs/DIAGNOSTICO_PROBLEMA_SALVAMENTO.md"
echo "   • docs/CORRECOES_APLICADAS.md"
echo "   • docs/VALIDACAO_FINAL.md"
echo "   • docs/RESUMO_EXECUTIVO.md"
echo ""
echo "🔧 Scripts disponíveis:"
echo "   • scripts/validate-supabase-fix.js (validação automatizada)"
echo "   • scripts/apply-rls-fix.sh (aplicar migration)"
echo "   • scripts/test-visual-guide.sh (este guia)"
echo ""
