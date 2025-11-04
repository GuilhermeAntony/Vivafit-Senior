-- Inserir exercícios de exemplo no banco de dados
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- Desabilitar temporariamente RLS para inserir dados iniciais
ALTER TABLE public.exercises DISABLE ROW LEVEL SECURITY;

-- Inserir exercícios (apenas se não existirem)
INSERT INTO public.exercises (name, description, category, duration, difficulty, instructions, is_active)
SELECT * FROM (VALUES
  ('Caminhada no lugar', 'Exercício de aquecimento cardiovascular básico', 'cardio'::exercise_category, 300, 1, 'Levante os joelhos alternadamente como se estivesse caminhando. Mantenha os braços em movimento.', true),
  ('Alongamento de braços', 'Alongamento suave para melhorar flexibilidade', 'flexibility'::exercise_category, 180, 1, 'Estenda um braço à frente do peito e puxe suavemente com a outra mão. Alterne os braços.', true),
  ('Exercício de equilíbrio', 'Melhora o equilíbrio e fortalece o core', 'balance'::exercise_category, 120, 2, 'Fique em pé apoiado em uma perna só. Use uma cadeira como apoio se necessário.', true),
  ('Flexão de braços na parede', 'Fortalecimento dos braços adaptado', 'strength'::exercise_category, 180, 2, 'De frente para a parede, apoie as mãos e faça movimentos de flexão.', true),
  ('Respiração profunda', 'Exercício de relaxamento e oxigenação', 'flexibility'::exercise_category, 240, 1, 'Inspire profundamente pelo nariz e expire lentamente pela boca.', true),
  ('Elevação de braços sentado', 'Fortalecimento dos ombros na cadeira', 'strength'::exercise_category, 150, 1, 'Sentado, levante os braços lateralmente até a altura dos ombros e abaixe lentamente.', true),
  ('Marcha estacionária', 'Cardio de baixo impacto', 'cardio'::exercise_category, 240, 2, 'Caminhe no lugar elevando bem os joelhos, mantendo postura ereta.', true),
  ('Rotação de tornozelos', 'Mobilidade e circulação', 'flexibility'::exercise_category, 90, 1, 'Sentado, gire os tornozelos em círculos, primeiro para um lado, depois para outro.', true),
  ('Equilíbrio em uma perna', 'Fortalecimento do core e equilíbrio', 'balance'::exercise_category, 60, 3, 'Segure em uma cadeira e tente ficar em uma perna só por 10-15 segundos.', true),
  ('Agachamento na cadeira', 'Fortalecimento das pernas', 'strength'::exercise_category, 120, 2, 'Sente e levante da cadeira sem usar as mãos, controlando o movimento.', true)
) AS v(name, description, category, duration, difficulty, instructions, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.exercises WHERE name = v.name
);

-- Reabilitar RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Verificar quantos exercícios foram inseridos
SELECT COUNT(*) as total_exercises FROM public.exercises;

-- Listar os exercícios inseridos
SELECT name, category, duration, difficulty FROM public.exercises ORDER BY category, name;
