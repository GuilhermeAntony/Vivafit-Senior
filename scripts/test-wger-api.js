#!/usr/bin/env node

/**
 * Script para testar a conectividade com a API WGER
 */

async function testWgerAPI() {
  console.log('🔍 Testando conexão com API WGER...\n');

  const endpoints = [
    {
      name: 'exerciseinfo (português)',
      url: 'https://wger.de/api/v2/exerciseinfo/?limit=5&language=2'
    },
    {
      name: 'exerciseinfo (inglês)',
      url: 'https://wger.de/api/v2/exerciseinfo/?limit=5&language=1'
    },
    {
      name: 'exercise (legacy)',
      url: 'https://wger.de/api/v2/exercise/?limit=5&language=2'
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testando: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      
      const startTime = Date.now();
      const response = await fetch(endpoint.url, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'pt-BR,pt'
        }
      });
      const duration = Date.now() - startTime;

      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Tempo: ${duration}ms`);

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Sucesso! ${data.results?.length || 0} exercícios retornados`);
        
        if (data.results?.length > 0) {
          const ex = data.results[0];
          const trans = ex.translations?.find(t => t.language === 2) || ex.translations?.[0];
          console.log(`   📋 Primeiro exercício: "${trans?.name || 'Sem nome'}"`);
          console.log(`      ID: ${ex.id}`);
          console.log(`      Categoria: ${ex.category?.name || 'N/A'}`);
          console.log(`      Músculos: ${ex.muscles?.length || 0}`);
          console.log(`      Imagens: ${ex.images?.length || 0}`);
          console.log(`      Traduções: ${ex.translations?.length || 0}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Erro: ${errorText.substring(0, 200)}`);
      }
    } catch (error) {
      console.log(`   ❌ Falha: ${error.message}`);
    }
    console.log('');
  }

  console.log('✨ Teste concluído!\n');
}

testWgerAPI().catch(console.error);
