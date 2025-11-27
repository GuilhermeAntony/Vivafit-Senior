// Script para popular o banco de dados com exercícios de exemplo
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://misptjgsftdtqfvqsneq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3B0amdzZnRkdHFmdnFzbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjgyODEsImV4cCI6MjA3Mjk0NDI4MX0.LkjTMPYMUmeWBSyemdl2WbPyA42hx_9FXYH0r5zhnoA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public'
  }
});

const exercises = [
  {
    name: 'Caminhada no lugar',
    description: 'Exercício de aquecimento cardiovascular básico',
    category: 'cardio',
    duration: 300,
    difficulty: 1,
    instructions: 'Levante os joelhos alternadamente como se estivesse caminhando. Mantenha os braços em movimento.',
    is_active: true
  },
  {
    name: 'Alongamento de braços',
    description: 'Alongamento suave para melhorar flexibilidade',
    category: 'flexibility',
    duration: 180,
    difficulty: 1,
    instructions: 'Estenda um braço à frente do peito e puxe suavemente com a outra mão. Alterne os braços.',
    is_active: true
  },
  {
    name: 'Exercício de equilíbrio',
    description: 'Melhora o equilíbrio e fortalece o core',
    category: 'balance',
    duration: 120,
    difficulty: 2,
    instructions: 'Fique em pé apoiado em uma perna só. Use uma cadeira como apoio se necessário.',
    is_active: true
  },
  {
    name: 'Flexão de braços na parede',
    description: 'Fortalecimento dos braços adaptado',
    category: 'strength',
    duration: 180,
    difficulty: 2,
    instructions: 'De frente para a parede, apoie as mãos e faça movimentos de flexão.',
    is_active: true
  },
  {
    name: 'Respiração profunda',
    description: 'Exercício de relaxamento e oxigenação',
    category: 'flexibility',
    duration: 240,
    difficulty: 1,
    instructions: 'Inspire profundamente pelo nariz e expire lentamente pela boca.',
    is_active: true
  },
  {
    name: 'Elevação de braços sentado',
    description: 'Fortalecimento dos ombros na cadeira',
    category: 'strength',
    duration: 150,
    difficulty: 1,
    instructions: 'Sentado, levante os braços lateralmente até a altura dos ombros e abaixe lentamente.',
    is_active: true
  },
  {
    name: 'Marcha estacionária',
    description: 'Cardio de baixo impacto',
    category: 'cardio',
    duration: 240,
    difficulty: 2,
    instructions: 'Caminhe no lugar elevando bem os joelhos, mantendo postura ereta.',
    is_active: true
  },
  {
    name: 'Rotação de tornozelos',
    description: 'Mobilidade e circulação',
    category: 'flexibility',
    duration: 90,
    difficulty: 1,
    instructions: 'Sentado, gire os tornozelos em círculos, primeiro para um lado, depois para outro.',
    is_active: true
  },
  {
    name: 'Equilíbrio em uma perna',
    description: 'Fortalecimento do core e equilíbrio',
    category: 'balance',
    duration: 60,
    difficulty: 3,
    instructions: 'Segure em uma cadeira e tente ficar em uma perna só por 10-15 segundos.',
    is_active: true
  },
  {
    name: 'Agachamento na cadeira',
    description: 'Fortalecimento das pernas',
    category: 'strength',
    duration: 120,
    difficulty: 2,
    instructions: 'Sente e levante da cadeira sem usar as mãos, controlando o movimento.',
    is_active: true
  }
];

async function populateExercises() {
  console.log(' Populando banco de dados com exercícios...\n');

  try {
    // Verificar se já existem exercícios
    const { data: existingExercises, error: checkError } = await supabase
      .from('exercises')
      .select('id, name');

    if (checkError) {
      console.error(' Erro ao verificar exercícios existentes:', checkError.message);
      return;
    }

    if (existingExercises && existingExercises.length > 0) {
      console.log(`  Já existem ${existingExercises.length} exercícios no banco.`);
      console.log('   Exercícios existentes:');
      existingExercises.forEach((ex, i) => {
        console.log(`   ${i + 1}. ${ex.name}`);
      });
      console.log('\n  Pulando inserção para evitar duplicatas.\n');
      return;
    }

    // Inserir exercícios
    console.log(` Inserindo ${exercises.length} exercícios...\n`);
    
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercises)
      .select();

    if (error) {
      console.error(' Erro ao inserir exercícios:', error.message);
      console.error('   Código:', error.code);
      console.error('   Detalhes:', error.details);
      return;
    }

    console.log(` ${data.length} exercícios inseridos com sucesso!\n`);
    console.log(' Exercícios criados:');
    data.forEach((exercise, index) => {
      console.log(`   ${index + 1}. ${exercise.name} (${exercise.category}) - ${exercise.duration}s`);
    });

    console.log('\n Banco de dados populado com sucesso!');

  } catch (e) {
    console.error(' Erro geral:', e.message);
  }
}

populateExercises();
