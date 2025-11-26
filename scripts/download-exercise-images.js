const fs = require('fs');
const path = require('path');

// Script para verificar se as imagens dos exercícios existem
// As imagens já devem estar em assets/exercises/

const exerciseImages = [
  'caminhada-lugar.jpg',
  'alongamento-bracos.jpg',
  'exercicio-cadeira.jpg',
  'equilibrio-apoio.jpg',
  'respiracao-profunda.jpg',
  'flexao-parede.jpg',
  'marcha-estacionaria.jpg',
  'rotacao-tornozelos.jpg',
  'agachamento-cadeira.jpg',
  'equilibrio-uma-perna.jpg'
];

const exercisesDir = path.join(__dirname, '..', 'assets', 'exercises');

console.log('Verificando imagens dos exercícios...\n');

let allImagesExist = true;

for (const imageName of exerciseImages) {
  const imagePath = path.join(exercisesDir, imageName);
  const exists = fs.existsSync(imagePath);
  
  if (exists) {
    const stats = fs.statSync(imagePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${imageName} (${sizeKB} KB)`);
  } else {
    console.log(`❌ ${imageName} - FALTANDO`);
    allImagesExist = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allImagesExist) {
  console.log('✅ Todas as imagens estão presentes!');
  console.log(`📁 Localização: ${exercisesDir}`);
} else {
  console.log('❌ Algumas imagens estão faltando!');
  console.log('Execute o script de download ou adicione as imagens manualmente.');
}

console.log('='.repeat(50));
