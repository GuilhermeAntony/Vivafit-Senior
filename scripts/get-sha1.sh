#!/bin/bash

# Script para obter SHA-1 do keystore para Google OAuth
# VivaFit Seniors Mobile

echo "🔐 Obtendo SHA-1 Fingerprints para Google Cloud Console"
echo "=========================================================="
echo ""

cd "$(dirname "$0")/.."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 Informações do Projeto:${NC}"
echo "  Package Name: com.antony13.Mobile"
echo "  Bundle ID: com.antony13.Mobile"
echo ""

# Debug SHA-1
echo -e "${YELLOW}🔍 Debug Keystore SHA-1 (para desenvolvimento):${NC}"
echo ""

if [ -f "android/app/debug.keystore" ]; then
    echo "Debug keystore encontrado em: android/app/debug.keystore"
    echo ""
    cd android
    ./gradlew signingReport | grep -A 2 "Variant: debug" | grep "SHA1:"
    cd ..
else
    echo "⚠️  Debug keystore não encontrado. Gerando relatório completo..."
    echo ""
    cd android
    ./gradlew signingReport 2>&1 | grep -A 2 "debug" | grep "SHA1:" | head -1
    cd ..
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Release SHA-1 (se existir)
if [ -f "$HOME/.android/debug.keystore" ]; then
    echo -e "${YELLOW}📦 Default Debug Keystore SHA-1:${NC}"
    keytool -list -v -keystore "$HOME/.android/debug.keystore" -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep "SHA1:" | head -1
    echo ""
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}📋 Próximos Passos:${NC}"
echo ""
echo "1. Copie o SHA-1 acima"
echo "2. Acesse: https://console.cloud.google.com/"
echo "3. Vá em: APIs e Serviços → Credenciais"
echo "4. Edite ou crie um ID do cliente OAuth 2.0 (Android)"
echo "5. Preencha:"
echo "   - Nome do pacote: com.antony13.Mobile"
echo "   - Impressão digital do certificado SHA-1: [cole aqui]"
echo "6. Salve"
echo "7. Crie também um ID do cliente OAuth 2.0 (Aplicativo da Web)"
echo "8. Copie o Web Client ID e cole em: src/lib/googleOAuthConfig.ts"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "  • Use o SHA-1 do DEBUG keystore para desenvolvimento"
echo "  • Use o SHA-1 do RELEASE keystore para produção"
echo "  • Configure AMBOS no Google Cloud Console se necessário"
echo "  • O Web Client ID é DIFERENTE do Android Client ID"
echo ""

echo -e "${GREEN}✅ Documentação completa:${NC}"
echo "  → docs/GOOGLE_AUTH_SETUP.md"
echo "  → docs/GOOGLE_AUTH_TROUBLESHOOTING.md"
echo "  → docs/GOOGLE_AUTH_CORRECTIONS.md"
echo ""
