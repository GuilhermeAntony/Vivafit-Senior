#!/usr/bin/env node

/**
 * Script para inspecionar a estrutura completa da resposta da API WGER
 */

async function inspectWgerAPI() {
  console.log('🔍 Inspecionando estrutura da API WGER...\n');

  try {
    const response = await fetch('https://wger.de/api/v2/exerciseinfo/?limit=2&language=2', {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'pt-BR,pt'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('📊 Estrutura da Resposta:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

inspectWgerAPI();
