# 🚀 Quick Start - Teste com EAS

## ⚡ Início Rápido (5 minutos)

### 1. Verificar Pré-requisitos

```bash
# Verificar se EAS CLI está instalado
eas --version

# Se não estiver, instalar:
npm install -g eas-cli

# Fazer login
eas login
```

---

### 2. Build para Teste (Recomendado)

```bash
# Opção A: Build Preview (mais rápido, 5-10 min)
eas build --platform android --profile preview

# Opção B: Usar script helper interativo
./scripts/eas-helper.sh
```

---

### 3. Aguardar Build

- ⏱️ Preview: ~5-10 minutos
- ⏱️ Production: ~15-20 minutos

**O terminal mostrará:**
- Link para acompanhar progresso
- QR Code para baixar quando concluído
- URL direta do APK

---

### 4. Instalar no Dispositivo

**Opção A: Via QR Code** (Mais fácil)
1. Escaneie o QR Code exibido no terminal
2. Baixe o APK
3. Instale no dispositivo

**Opção B: Via ADB**
```bash
# Baixar APK primeiro
# Depois instalar via ADB
adb install ~/Downloads/build-xxx.apk
```

**Opção C: Via Link Direto**
1. Copie o link do build
2. Abra no celular
3. Baixe e instale

---

### 5. Testar App

✅ **Funcionalidades para testar:**

1. **Login/Cadastro**
   - Criar nova conta
   - Verificar se cria perfil automaticamente

2. **Exercícios**
   - Ver lista de 10 exercícios
   - Abrir detalhes de um exercício
   - Filtrar por categoria

3. **Treinos**
   - Criar novo treino
   - Adicionar exercícios ao treino
   - Iniciar treino
   - Completar exercícios

4. **Perfil**
   - Ver dados do perfil
   - Editar informações
   - Salvar alterações

5. **Offline**
   - Desconectar internet
   - Fechar app
   - Reabrir
   - Exercícios devem carregar do cache

---

## 🎯 Comandos Essenciais

```bash
# Ver builds recentes
eas build:list

# Ver detalhes do último build
eas build:view

# Cancelar build em andamento
eas build:cancel

# Ver status do projeto
eas project:info

# Script helper interativo
./scripts/eas-helper.sh
```

---

## 🐛 Problemas Comuns

### Build falha:

```bash
# 1. Verificar login
eas whoami

# 2. Limpar cache e tentar novamente
npm cache clean --force
rm -rf node_modules
npm install
eas build --platform android --profile preview --clear-cache
```

### App crasha ao abrir:

1. Verificar se credenciais Supabase estão corretas em `app.json`
2. Ver logs: `adb logcat | grep -i "ReactNativeJS"`
3. Rebuild com `--clear-cache`

### Não consigo instalar APK:

1. Habilitar "Fontes desconhecidas" no Android
2. Usar `adb install -r` para forçar reinstalação

---

## 📱 Perfis de Build

| Profile | Quando Usar | Tempo | Tamanho |
|---------|-------------|-------|---------|
| **preview** | Testes rápidos | ~5-10 min | Médio |
| **development** | Dev diário | ~10-15 min | Grande |
| **production** | Produção/Store | ~15-20 min | Pequeno |

---

## 🔐 Configurar Secrets (Opcional)

Se quiser usar secrets em vez de `app.json`:

```bash
# Adicionar SUPABASE_URL
eas secret:create --scope project --name SUPABASE_URL --value "https://misptjgsftdtqfvqsneq.supabase.co"

# Adicionar SUPABASE_ANON_KEY  
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "sua-chave-aqui"

# Listar secrets
eas secret:list
```

Depois, atualizar `app.config.js` para usar `process.env`:

```javascript
export default {
  // ...
  extra: {
    supabase: {
      url: process.env.SUPABASE_URL || "https://misptjgsftdtqfvqsneq.supabase.co",
      anonKey: process.env.SUPABASE_ANON_KEY || "sua-chave-fallback",
    }
  }
}
```

---

## ✅ Checklist Pré-Build

- [ ] `eas login` executado
- [ ] Credenciais Supabase em `app.json` ou secrets
- [ ] `eas.json` configurado com profiles
- [ ] `npm install` sem erros
- [ ] Código commitado (opcional mas recomendado)

---

## 🚀 Começar AGORA

```bash
# Comando simples para começar
eas build --platform android --profile preview
```

Depois de 5-10 minutos, você terá um APK pronto para testar! 🎉

---

## 📚 Documentação Completa

- **Guia Detalhado:** `docs/EAS_BUILD_GUIDE.md`
- **Script Helper:** `./scripts/eas-helper.sh`
- **Troubleshooting:** https://docs.expo.dev/build-reference/troubleshooting/
