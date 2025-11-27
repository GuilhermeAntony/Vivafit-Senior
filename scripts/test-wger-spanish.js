#!/usr/bin/env node

/**
 * Testar exercícios em espanhol (language=4)
 */

async function testSpanish() {
  console.log('🇪🇸 Testando WGER em Espanhol (language=4)...\n');

  try {
    const response = await fetch('https://wger.de/api/v2/exerciseinfo/?limit=10&language=4', {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'es,pt-BR,pt'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`✅ ${data.results?.length || 0} exercícios retornados\n`);
    
    data.results?.slice(0, 5).forEach((ex, idx) => {
      const spanishTrans = ex.translations?.find(t => t.language === 4);
      const englishTrans = ex.translations?.find(t => t.language === 2);
      
      console.log(`${idx + 1}. ID: ${ex.id}`);
      console.log(`   🇪🇸 Espanhol: ${spanishTrans?.name || 'N/A'}`);
      console.log(`   🇬🇧 Inglês: ${englishTrans?.name || 'N/A'}`);
      console.log(`   Categoria: ${ex.category?.name || 'N/A'}`);
      console.log(`   Músculos: ${ex.muscles?.length || 0}`);
      console.log(`   Descrição (ES): ${spanishTrans?.description?.substring(0, 100).replace(/<[^>]+>/g, '') || 'N/A'}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testSpanish();
