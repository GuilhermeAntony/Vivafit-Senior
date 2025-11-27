// Exercícios predefinidos baseados no repositório VivaFit Seniors
// Adaptado para React Native com interfaces tipadas

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  difficulty: 'Baixo' | 'Médio' | 'Alto';
  category: 'Cardio' | 'Força' | 'Flexibilidade' | 'Equilíbrio';
  benefits: string[];
  instructions: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface WorkoutStep {
  id: string;
  name: string;
  instruction: string;
  duration: number; // em segundos
  restDuration?: number; // em segundos
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'Exercício' | 'Nutrição' | 'Descanso' | 'Hidratação';
  icon: string; // Nome do ícone para React Native
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

// Exercícios pré-definidos
export const PREDEFINED_EXERCISES: Exercise[] = [
  {
    id: 'caminhada-lugar',
    name: 'Caminhada no Lugar',
    description: 'Movimento suave de caminhada sem sair do lugar',
    imageUrl: require('../../assets/exercises/caminhada-lugar.jpg'),
    duration: 5,
    difficulty: 'Baixo',
    category: 'Cardio',
    benefits: ['Melhora circulação', 'Aquecimento corporal', 'Baixo impacto'],
    instructions: 'Levante os joelhos alternadamente como se estivesse caminhando. Mantenha os braços em movimento.'
  },
  {
    id: 'alongamento-bracos',
    name: 'Alongamento de Braços',
    description: 'Exercícios suaves para manter a flexibilidade dos braços',
    imageUrl: require('../../assets/exercises/alongamento-bracos.jpg'),
    duration: 8,
    difficulty: 'Baixo',
    category: 'Flexibilidade',
    benefits: ['Reduz tensão', 'Melhora mobilidade', 'Relaxamento'],
    instructions: 'Estenda um braço à frente do peito e puxe suavemente com a outra mão. Alterne os braços.'
  },
  {
    id: 'alongamento-pescoco',
    name: 'Alongamento de Pescoço',
    description: 'Exercícios suaves para relaxar a região cervical',
    imageUrl: require('../../assets/exercises/alongamento-pescoco.jpg'),
    duration: 5,
    difficulty: 'Baixo',
    category: 'Flexibilidade',
    benefits: ['Alivia tensão', 'Reduz dor cervical', 'Melhora mobilidade'],
    instructions: 'Sentado com as costas retas, incline suavemente a cabeça para o lado direito, segure por 10 segundos, depois para o lado esquerdo. Faça movimentos lentos e controlados.'
  },
  {
    id: 'circulos-ombros',
    name: 'Círculos com os Ombros',
    description: 'Movimento circular suave para mobilidade dos ombros',
    imageUrl: require('../../assets/exercises/circulos-ombros.jpg'),
    duration: 4,
    difficulty: 'Baixo',
    category: 'Flexibilidade',
    benefits: ['Relaxa ombros', 'Melhora mobilidade', 'Reduz rigidez'],
    instructions: 'Em pé ou sentado, faça movimentos circulares com os ombros, primeiro para frente 10 vezes, depois para trás 10 vezes. Mantenha os braços relaxados ao lado do corpo.'
  },
  {
    id: 'respiracao-profunda',
    name: 'Respiração Profunda',
    description: 'Técnicas de respiração para relaxamento e oxigenação',
    imageUrl: require('../../assets/exercises/respiracao-profunda.jpg'),
    duration: 4,
    difficulty: 'Baixo',
    category: 'Flexibilidade',
    benefits: ['Reduz estresse', 'Melhora oxigenação', 'Relaxamento mental'],
    instructions: 'Inspire profundamente pelo nariz e expire lentamente pela boca.'
  },
  {
    id: 'flexao-parede',
    name: 'Flexão na Parede',
    description: 'Fortalecimento dos braços adaptado para idosos',
    imageUrl: require('../../assets/exercises/flexao-parede.jpg'),
    duration: 8,
    difficulty: 'Médio',
    category: 'Força',
    benefits: ['Fortalece braços', 'Melhora tônus muscular', 'Baixo impacto'],
    instructions: 'De frente para a parede, apoie as mãos e faça movimentos de flexão.'
  },
  {
    id: 'elevacao-bracos-sentado',
    name: 'Elevação de Braços Sentado',
    description: 'Fortalecimento dos ombros sentado na cadeira',
    imageUrl: require('../../assets/exercises/elevacao-bracos-sentado.jpg'),
    duration: 5,
    difficulty: 'Baixo',
    category: 'Força',
    benefits: ['Fortalece ombros', 'Melhora postura', 'Muito seguro'],
    instructions: 'Sentado com as costas retas, levante os braços lateralmente até a altura dos ombros e abaixe lentamente. Repita o movimento de forma controlada.'
  },
  {
    id: 'rotacao-tornozelos',
    name: 'Rotação de Tornozelos',
    description: 'Exercício para mobilidade e circulação',
    imageUrl: require('../../assets/exercises/rotacao-tornozelos.jpg'),
    duration: 3,
    difficulty: 'Baixo',
    category: 'Flexibilidade',
    benefits: ['Melhora circulação', 'Aumenta mobilidade', 'Previne rigidez'],
    instructions: 'Sentado, gire os tornozelos em círculos, primeiro para um lado, depois para outro.'
  },
  {
    id: 'agachamento-cadeira',
    name: 'Agachamento na Cadeira',
    description: 'Fortalecimento das pernas com segurança',
    imageUrl: require('../../assets/exercises/agachamento-cadeira.jpg'),
    duration: 6,
    difficulty: 'Alto',
    category: 'Força',
    benefits: ['Fortalece pernas', 'Melhora mobilidade', 'Funcional'],
    instructions: 'Sente e levante da cadeira sem usar as mãos, controlando o movimento.'
  },
  {
    id: ' ',
    name: 'Equilíbrio em Uma Perna',
    description: 'Desafio de equilíbrio para fortalecer o core',
    imageUrl: require('../../assets/exercises/equilibrio-uma-perna.jpg'),
    duration: 2,
    difficulty: 'Alto',
    category: 'Equilíbrio',
    benefits: ['Melhora equilíbrio', 'Fortalece core', 'Previne quedas'],
    instructions: 'Segure em uma cadeira e tente ficar em uma perna só por 10-15 segundos.'
  }
];

// Dicas predefinidas por categoria
export const PREDEFINED_TIPS: Tip[] = [
  {
    id: 'warmup',
    title: 'Sempre aqueça antes',
    content: 'Dedique pelo menos 5 minutos para aquecer o corpo antes de qualquer exercício. Isso prepara seus músculos e reduz o risco de lesões.',
    category: 'Exercício',
    icon: 'heart',
    color: '#0ea5a3'
  },
  {
    id: 'hydration',
    title: 'Mantenha-se hidratado',
    content: 'Beba água antes, durante e depois dos exercícios. A hidratação adequada é essencial para o bom funcionamento do corpo.',
    category: 'Hidratação',
    icon: 'droplet',
    color: '#3b82f6'
  },
  {
    id: 'listen-body',
    title: 'Escute seu corpo',
    content: 'Se sentir dor ou desconforto, pare imediatamente. O exercício deve ser desafiador, mas nunca doloroso.',
    category: 'Exercício',
    icon: 'heart',
    color: '#0ea5a3'
  },
  {
    id: 'rest-important',
    title: 'Descanso é fundamental',
    content: 'Seu corpo precisa de tempo para se recuperar. Inclua dias de descanso em sua rotina de exercícios.',
    category: 'Descanso',
    icon: 'moon',
    color: '#8b5cf6'
  },
  {
    id: 'balanced-diet',
    title: 'Alimentação balanceada',
    content: 'Combine exercícios com uma alimentação rica em frutas, verduras e proteínas para melhores resultados.',
    category: 'Nutrição',
    icon: 'utensils',
    color: '#10b981'
  },
  {
    id: 'consistency',
    title: 'Consistência é a chave',
    content: 'É melhor fazer 15 minutos de exercício todos os dias do que 2 horas uma vez por semana.',
    category: 'Exercício',
    icon: 'heart',
    color: '#0ea5a3'
  },
  {
    id: 'comfortable-clothes',
    title: 'Use roupas confortáveis',
    content: 'Vista roupas leves e calçados apropriados para se exercitar com segurança e conforto.',
    category: 'Exercício',
    icon: 'heart',
    color: '#0ea5a3'
  },
  {
    id: 'progress-gradual',
    title: 'Progresso gradual',
    content: 'Aumente a intensidade dos exercícios gradualmente. Seu corpo precisa de tempo para se adaptar.',
    category: 'Exercício',
    icon: 'heart',
    color: '#0ea5a3'
  }
];

// Conquistas predefinidas
export const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    title: 'Primeiro Treino',
    description: 'Complete seu primeiro exercício',
    icon: 'star',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'week-warrior',
    title: 'Guerreiro da Semana',
    description: 'Complete 5 treinos em uma semana',
    icon: 'trophy',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'consistency-king',
    title: 'Rei da Consistência',
    description: 'Treine por 7 dias consecutivos',
    icon: 'calendar',
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'target-master',
    title: 'Mestre dos Objetivos',
    description: 'Atinja sua meta semanal 4 vezes',
    icon: 'target',
    unlocked: false,
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'cardio-champion',
    title: 'Campeão Cardio',
    description: 'Complete 10 exercícios de cardio',
    icon: 'heart',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'balance-master',
    title: 'Mestre do Equilíbrio',
    description: 'Complete 5 exercícios de equilíbrio',
    icon: 'activity',
    unlocked: false,
    progress: 0,
    maxProgress: 5
  }
];

// Workouts personalizados por nível de atividade
export const getWorkoutByActivityLevel = (activityLevel: number): WorkoutStep[] => {
  const workouts = {
    0: [ // Baixo (nenhum ou até 1x na semana)
      {
        id: 'warmup',
        name: 'Respiração',
        instruction: 'Respire profundamente pelo nariz e solte pela boca. Relaxe os ombros.',
        duration: 60,
        restDuration: 15
      },
      {
        id: 'gentle',
        name: 'Movimentos Suaves',
        instruction: 'Mova os braços gentilmente para cima e para baixo. Vá no seu ritmo.',
        duration: 120,
        restDuration: 30
      }
    ],
    1: [ // Médio (2 a 3x na semana)
      {
        id: 'warmup',
        name: 'Aquecimento',
        instruction: 'Caminhe no lugar suavemente por um tempo. Mantenha o ritmo confortável.',
        duration: 90,
        restDuration: 20
      },
      {
        id: 'strength',
        name: 'Fortalecimento',
        instruction: 'Use uma cadeira como apoio. Levante e abaixe os braços lentamente.',
        duration: 180,
        restDuration: 30
      }
    ],
    2: [ // Alto/Atleta (acima de 4x na semana)
      {
        id: 'warmup',
        name: 'Aquecimento Ativo',
        instruction: 'Caminhe no lugar com mais energia. Mova os braços junto com as pernas.',
        duration: 120,
        restDuration: 30
      },
      {
        id: 'cardio',
        name: 'Cardio Suave',
        instruction: 'Continue caminhando e adicione pequenos movimentos com os braços.',
        duration: 300,
        restDuration: 45
      },
      {
        id: 'balance',
        name: 'Equilíbrio',
        instruction: 'Com apoio de uma cadeira, pratique ficar em um pé por alguns segundos.',
        duration: 180
      }
    ]
  };

  return workouts[activityLevel as keyof typeof workouts] || workouts[1];
};

// Função para converter exercício selecionado em workout steps
export const convertExerciseToWorkout = (exercise: Exercise): WorkoutStep[] => {
  return [
    {
      id: 'warmup',
      name: 'Aquecimento',
      instruction: 'Respire profundamente e mova-se suavemente por alguns momentos.',
      duration: 30,
      restDuration: 10
    },
    {
      id: 'main',
      name: exercise.name,
      instruction: exercise.description + '. Mantenha o ritmo confortável e respire normalmente.',
      duration: exercise.duration * 60, // converter minutos para segundos
      restDuration: 15
    },
    {
      id: 'cooldown',
      name: 'Relaxamento',
      instruction: 'Respire calmamente e relaxe os músculos trabalhados.',
      duration: 45
    }
  ];
};

// Categorias de exercícios
export const EXERCISE_CATEGORIES = ['Todos', 'Cardio', 'Força', 'Flexibilidade', 'Equilíbrio'];

// Cores para dificuldade
export const DIFFICULTY_COLORS = {
  'Baixo': '#10b981', // verde
  'Médio': '#f59e0b', // amarelo
  'Alto': '#ef4444'   // vermelho
};

// Cores para categorias
export const CATEGORY_COLORS = {
  'Cardio': '#3b82f6',      // azul
  'Força': '#8b5cf6',       // roxo
  'Flexibilidade': '#0ea5a3', // teal (cor primária)
  'Equilíbrio': '#f59e0b'   // amarelo
};