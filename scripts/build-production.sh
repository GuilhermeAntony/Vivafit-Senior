#!/bin/bash

# 🚀 Script de Build de Produção - VivaFit Seniors
# Facilita o processo de build com validações e verificações

set -e  # Parar em caso de erro

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 Build de Produção - VivaFit Seniors                   ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Função para perguntar
ask_continue() {
    read -p "$1 (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}⏸️  Operação cancelada${NC}"
        exit 0
    fi
}

# Etapa 1: Verificar EAS login
echo -e "${BLUE}📋 Etapa 1: Verificando login EAS...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${RED}❌ Você não está logado no EAS${NC}"
    echo "Execute: eas login"
    exit 1
fi
echo -e "${GREEN}✅ Logado como: $(eas whoami)${NC}"
echo ""

# Etapa 2: Validar código TypeScript
echo -e "${BLUE}📋 Etapa 2: Validando código TypeScript...${NC}"
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ Código TypeScript válido${NC}"
else
    echo -e "${RED}❌ Erros encontrados no código TypeScript${NC}"
    ask_continue "Deseja continuar mesmo com erros?"
fi
echo ""

# Etapa 3: Validar conexão Supabase
echo -e "${BLUE}📋 Etapa 3: Validando conexão com Supabase...${NC}"
if node scripts/validate-supabase-fix.js > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Supabase configurado corretamente${NC}"
else
    echo -e "${YELLOW}⚠️  Aviso: Problemas na validação do Supabase${NC}"
    ask_continue "Deseja continuar?"
fi
echo ""

# Etapa 4: Verificar secrets EAS
echo -e "${BLUE}📋 Etapa 4: Verificando secrets do EAS...${NC}"
echo "Listando secrets configurados..."
eas secret:list 2>&1 | grep -i "supabase" || echo -e "${YELLOW}⚠️  Nenhum secret do Supabase encontrado${NC}"
echo ""

# Etapa 5: Escolher tipo de build
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Escolha o tipo de build:                                 ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "1) Preview Build (APK para teste - ~15-20 min)"
echo "   • Gera APK instalável para testes"
echo "   • Não otimizado, mas mais rápido"
echo "   • Ideal para validação antes da produção"
echo ""
echo "2) Production Build (APK final - ~20-30 min)"
echo "   • Gera APK otimizado e assinado"
echo "   • Pronto para Google Play Store"
echo "   • Minificado e otimizado"
echo ""
echo "3) Ambos (Preview primeiro, depois Production)"
echo ""
read -p "Escolha uma opção (1/2/3): " -n 1 -r
echo ""

BUILD_TYPE=""
case $REPLY in
    1)
        BUILD_TYPE="preview"
        echo -e "${GREEN}✅ Iniciando Preview Build${NC}"
        ;;
    2)
        BUILD_TYPE="production"
        echo -e "${GREEN}✅ Iniciando Production Build${NC}"
        ;;
    3)
        BUILD_TYPE="both"
        echo -e "${GREEN}✅ Iniciando Preview + Production Build${NC}"
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac
echo ""

# Etapa 6: Confirmação final
echo -e "${YELLOW}⚠️  ATENÇÃO:${NC}"
echo "• A build será executada na nuvem do EAS"
echo "• Tempo estimado: 15-30 minutos"
echo "• Consumirá créditos de build do EAS"
echo "• A build será pública no seu dashboard EAS"
echo ""
ask_continue "Deseja continuar com a build?"

# Etapa 7: Executar build
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🏗️  Iniciando Build...                                    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$BUILD_TYPE" = "preview" ] || [ "$BUILD_TYPE" = "both" ]; then
    echo -e "${BLUE}🔨 Executando Preview Build...${NC}"
    echo ""
    eas build --profile preview --platform android --non-interactive
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Preview Build concluída com sucesso!${NC}"
        echo ""
        echo "📥 Para baixar o APK:"
        echo "   eas build:download --platform android --profile preview"
        echo ""
        echo "🔗 Ou acesse o dashboard:"
        echo "   https://expo.dev/accounts/antony13/projects/Mobile/builds"
        echo ""
    else
        echo -e "${RED}❌ Erro na Preview Build${NC}"
        exit 1
    fi
fi

if [ "$BUILD_TYPE" = "production" ] || [ "$BUILD_TYPE" = "both" ]; then
    if [ "$BUILD_TYPE" = "both" ]; then
        echo ""
        ask_continue "Preview Build concluída. Continuar com Production Build?"
        echo ""
    fi
    
    echo -e "${BLUE}🔨 Executando Production Build...${NC}"
    echo ""
    eas build --profile production --platform android --non-interactive
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Production Build concluída com sucesso!${NC}"
        echo ""
        echo "📥 Para baixar o APK:"
        echo "   eas build:download --platform android --profile production"
        echo ""
        echo "🚀 Para submeter à Play Store:"
        echo "   eas submit --platform android --profile production"
        echo ""
        echo "🔗 Ou acesse o dashboard:"
        echo "   https://expo.dev/accounts/antony13/projects/Mobile/builds"
        echo ""
    else
        echo -e "${RED}❌ Erro na Production Build${NC}"
        exit 1
    fi
fi

# Etapa 8: Próximos passos
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  📋 Próximos Passos                                       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "1️⃣  Aguarde a build completar (~15-30 min)"
echo "    Você receberá um email quando concluir"
echo ""
echo "2️⃣  Baixe o APK:"
echo -e "    ${GREEN}eas build:download --platform android${NC}"
echo ""
echo "3️⃣  Instale no dispositivo:"
echo -e "    ${GREEN}adb install app-preview.apk${NC}"
echo "    Ou envie o APK para o dispositivo"
echo ""
echo "4️⃣  Execute os testes do guia:"
echo -e "    ${GREEN}./scripts/test-visual-guide.sh${NC}"
echo ""
echo "5️⃣  Se tudo estiver OK, publique na Play Store:"
echo -e "    ${GREEN}eas submit --platform android --profile production${NC}"
echo ""
echo -e "${GREEN}🎉 Build iniciada com sucesso!${NC}"
echo ""
