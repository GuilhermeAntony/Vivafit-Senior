-- Enhanced VivaFit Seniors Schema - SAFE VERSION
-- Esta versão pode ser executada múltiplas vezes sem erros
-- Baseado na análise do repositório externo

-- Habilita a extensão pgcrypto para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- STEP 1: Criar tipos ENUM (com verificação de existência)
-- ============================================================

-- Criar tipo app_role se não existir
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tipo activity_level se não existir
DO $$ BEGIN
    CREATE TYPE public.activity_level AS ENUM ('low', 'sedentary', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tipo exercise_category se não existir
DO $$ BEGIN
    CREATE TYPE public.exercise_category AS ENUM ('cardio', 'strength', 'flexibility', 'balance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- STEP 2: Criar tabelas (IF NOT EXISTS)
-- ============================================================

-- Tabela profiles (perfis de usuário)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  age INTEGER,
  weight NUMERIC,
  activity_level activity_level DEFAULT 'sedentary',
  health_limitations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela user_roles (papéis de usuário)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Tabela exercises (exercícios)
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category exercise_category NOT NULL,
  duration INTEGER NOT NULL, -- em segundos
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5) DEFAULT 1,
  instructions TEXT,
  image_url TEXT,
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela workouts (treinos)
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_duration INTEGER DEFAULT 0, -- em segundos
  exercises_completed INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela workout_exercises (junção treino-exercício)
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  duration INTEGER, -- duração customizada para este treino
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela user_progress (progresso do usuário)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL, -- em segundos
  calories_burned INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela user_achievements (conquistas do usuário)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- STEP 3: Habilitar Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: Criar funções de segurança
-- ============================================================

-- Função para verificar se usuário tem uma role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para obter role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- ============================================================
-- STEP 5: Criar políticas RLS (DROP se existir, depois CREATE)
-- ============================================================

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policies para user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policies para exercises (leitura pública, escrita admin)
DROP POLICY IF EXISTS "Anyone can view active exercises" ON public.exercises;
CREATE POLICY "Anyone can view active exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (is_active = true);

-- Policies para workouts
DROP POLICY IF EXISTS "Users can view their own workouts" ON public.workouts;
CREATE POLICY "Users can view their own workouts"
ON public.workouts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own workouts" ON public.workouts;
CREATE POLICY "Users can create their own workouts"
ON public.workouts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own workouts" ON public.workouts;
CREATE POLICY "Users can update their own workouts"
ON public.workouts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policies para workout_exercises
DROP POLICY IF EXISTS "Users can view workout exercises for their workouts" ON public.workout_exercises;
CREATE POLICY "Users can view workout exercises for their workouts"
ON public.workout_exercises
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage workout exercises for their workouts" ON public.workout_exercises;
CREATE POLICY "Users can manage workout exercises for their workouts"
ON public.workout_exercises
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  )
);

-- Policies para user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
CREATE POLICY "Users can view their own progress"
ON public.user_progress
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own progress" ON public.user_progress;
CREATE POLICY "Users can create their own progress"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policies para user_achievements
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can earn achievements" ON public.user_achievements;
CREATE POLICY "Users can earn achievements"
ON public.user_achievements
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- STEP 6: Criar função e trigger para updated_at
-- ============================================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para exercises
DROP TRIGGER IF EXISTS update_exercises_updated_at ON public.exercises;
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- STEP 7: Função para criar perfil automaticamente ao registrar
-- ============================================================

-- Função para lidar com novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Criar profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email)
  );
  
  -- Atribuir role padrão de user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger para criar profile e role quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STEP 8: Inserir exercícios de exemplo (se não existirem)
-- ============================================================

INSERT INTO public.exercises (name, description, category, duration, difficulty, instructions)
SELECT * FROM (VALUES
  ('Caminhada no lugar', 'Exercício de aquecimento cardiovascular básico', 'cardio'::exercise_category, 300, 1, 'Levante os joelhos alternadamente como se estivesse caminhando. Mantenha os braços em movimento.'),
  ('Alongamento de braços', 'Alongamento suave para melhorar flexibilidade', 'flexibility'::exercise_category, 180, 1, 'Estenda um braço à frente do peito e puxe suavemente com a outra mão. Alterne os braços.'),
  ('Exercício de equilíbrio', 'Melhora o equilíbrio e fortalece o core', 'balance'::exercise_category, 120, 2, 'Fique em pé apoiado em uma perna só. Use uma cadeira como apoio se necessário.'),
  ('Flexão de braços na parede', 'Fortalecimento dos braços adaptado', 'strength'::exercise_category, 180, 2, 'De frente para a parede, apoie as mãos e faça movimentos de flexão.'),
  ('Respiração profunda', 'Exercício de relaxamento e oxigenação', 'flexibility'::exercise_category, 240, 1, 'Inspire profundamente pelo nariz e expire lentamente pela boca.'),
  ('Elevação de braços sentado', 'Fortalecimento dos ombros na cadeira', 'strength'::exercise_category, 150, 1, 'Sentado, levante os braços lateralmente até a altura dos ombros e abaixe lentamente.'),
  ('Marcha estacionária', 'Cardio de baixo impacto', 'cardio'::exercise_category, 240, 2, 'Caminhe no lugar elevando bem os joelhos, mantendo postura ereta.'),
  ('Rotação de tornozelos', 'Mobilidade e circulação', 'flexibility'::exercise_category, 90, 1, 'Sentado, gire os tornozelos em círculos, primeiro para um lado, depois para outro.'),
  ('Equilíbrio em uma perna', 'Fortalecimento do core e equilíbrio', 'balance'::exercise_category, 60, 3, 'Segure em uma cadeira e tente ficar em uma perna só por 10-15 segundos.'),
  ('Agachamento na cadeira', 'Fortalecimento das pernas', 'strength'::exercise_category, 120, 2, 'Sente e levante da cadeira sem usar as mãos, controlando o movimento.')
) AS v(name, description, category, duration, difficulty, instructions)
WHERE NOT EXISTS (
  SELECT 1 FROM public.exercises WHERE name = v.name
);

-- ============================================================
-- FINALIZADO! Schema criado com sucesso
-- ============================================================
