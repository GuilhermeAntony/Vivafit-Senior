#!/bin/bash

# Script helper para builds EAS - VivaFit Seniors

echo "🚀 VivaFit Seniors - EAS Build Helper"
echo "====================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir menu
show_menu() {
  echo "Escolha uma opção:"
  echo ""
  echo "  ${BLUE}1)${NC} Build Development (com dev client)"
  echo "  ${BLUE}2)${NC} Build Preview (APK para testes)"
  echo "  ${BLUE}3)${NC} Build Production (APK final)"
  echo "  ${BLUE}4)${NC} Listar builds recentes"
  echo "  ${BLUE}5)${NC} Ver último build"
  echo "  ${BLUE}6)${NC} Configurar EAS Secrets"
  echo "  ${BLUE}7)${NC} Verificar status do projeto"
  echo "  ${BLUE}8)${NC} Iniciar dev server (após build development)"
  echo "  ${BLUE}9)${NC} Sair"
  echo ""
  read -p "Digite sua escolha [1-9]: " choice
}

# Verificar se está logado no EAS
check_eas_login() {
  if ! eas whoami &> /dev/null; then
    echo "${RED}❌ Você não está logado no EAS${NC}"
    echo "Execute: ${YELLOW}eas login${NC}"
    exit 1
  fi
  
  USER=$(eas whoami 2>&1)
  echo "${GREEN}✅ Logado como:${NC} $USER"
  echo ""
}

# Build Development
build_development() {
  echo "${YELLOW}🔨 Iniciando build DEVELOPMENT...${NC}"
  echo "Esse build inclui ferramentas de debug e dev client"
  echo ""
  eas build --platform android --profile development
}

# Build Preview
build_preview() {
  echo "${YELLOW}🔨 Iniciando build PREVIEW...${NC}"
  echo "Esse build gera APK para testes internos"
  echo ""
  eas build --platform android --profile preview
}

# Build Production
build_production() {
  echo "${YELLOW}🔨 Iniciando build PRODUCTION...${NC}"
  echo "Esse build gera APK otimizado para produção"
  echo ""
  read -p "Tem certeza? (s/n): " confirm
  if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
    eas build --platform android --profile production
  else
    echo "Build cancelado"
  fi
}

# Listar builds
list_builds() {
  echo "${BLUE}📋 Builds recentes:${NC}"
  echo ""
  eas build:list --platform android --limit 5
}

# Ver último build
view_last_build() {
  echo "${BLUE}🔍 Último build:${NC}"
  echo ""
  eas build:list --platform android --limit 1
}

# Configurar secrets
configure_secrets() {
  echo "${YELLOW}🔐 Configurar EAS Secrets${NC}"
  echo ""
  echo "Secrets atuais:"
  eas secret:list
  echo ""
  echo "Adicionar novo secret?"
  echo "1) SUPABASE_URL"
  echo "2) SUPABASE_ANON_KEY"
  echo "3) Outro"
  echo "4) Voltar"
  read -p "Escolha [1-4]: " secret_choice
  
  case $secret_choice in
    1)
      read -p "Digite o SUPABASE_URL: " url
      eas secret:create --scope project --name SUPABASE_URL --value "$url"
      ;;
    2)
      read -p "Digite o SUPABASE_ANON_KEY: " key
      eas secret:create --scope project --name SUPABASE_ANON_KEY --value "$key"
      ;;
    3)
      read -p "Nome do secret: " name
      read -p "Valor do secret: " value
      eas secret:create --scope project --name "$name" --value "$value"
      ;;
    4)
      return
      ;;
  esac
}

# Ver status do projeto
project_status() {
  echo "${BLUE}ℹ️  Status do Projeto:${NC}"
  echo ""
  eas project:info
}

# Iniciar dev server
start_dev_server() {
  echo "${GREEN}🚀 Iniciando dev server para build development...${NC}"
  echo ""
  echo "Certifique-se de que o build development já está instalado no dispositivo!"
  echo ""
  npx expo start --dev-client
}

# Main loop
main() {
  check_eas_login
  
  while true; do
    show_menu
    
    case $choice in
      1)
        build_development
        ;;
      2)
        build_preview
        ;;
      3)
        build_production
        ;;
      4)
        list_builds
        ;;
      5)
        view_last_build
        ;;
      6)
        configure_secrets
        ;;
      7)
        project_status
        ;;
      8)
        start_dev_server
        break
        ;;
      9)
        echo "👋 Até logo!"
        exit 0
        ;;
      *)
        echo "${RED}❌ Opção inválida${NC}"
        ;;
    esac
    
    echo ""
    echo "-----------------------------------"
    echo ""
    read -p "Pressione Enter para continuar..."
    clear
  done
}

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
  echo "${RED}❌ EAS CLI não está instalado${NC}"
  echo ""
  echo "Instale com: ${YELLOW}npm install -g eas-cli${NC}"
  exit 1
fi

# Executar
clear
main
