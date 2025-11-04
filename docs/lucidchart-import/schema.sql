-- Schema SQL Simplificado para Importação no Lucidchart
-- VivaFit Seniors - Diagrama de Entidade-Relacionamento

-- Tabela de usuários (gerenciada pelo Supabase Auth)
CREATE TABLE auth_users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    raw_user_meta_data JSONB
);

-- Tabela de perfis dos usuários
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    display_name TEXT,
    age INTEGER,
    weight NUMERIC,
    activity_level VARCHAR(20) CHECK (activity_level IN ('low', 'sedentary', 'high')),
    health_limitations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de papéis/permissões
CREATE TABLE user_roles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Catálogo de exercícios
CREATE TABLE exercises (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category VARCHAR(20) CHECK (category IN ('cardio', 'strength', 'flexibility', 'balance')),
    duration INTEGER NOT NULL,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    instructions TEXT,
    image_url TEXT,
    video_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treinos personalizados dos usuários
CREATE TABLE workouts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    total_duration INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    total_exercises INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de junção: Exercícios em cada treino
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY,
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    duration INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Histórico de progresso do usuário
CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL,
    calories_burned INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sistema de conquistas/gamificação
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários sobre o schema (serão ignorados na importação, mas úteis para documentação)
COMMENT ON TABLE profiles IS 'Perfil personalizado do usuário com dados demográficos e de saúde para idosos';
COMMENT ON TABLE exercises IS 'Catálogo de exercícios adaptados para público idoso (50-75 anos)';
COMMENT ON TABLE workouts IS 'Treinos customizados criados pelos usuários';
COMMENT ON TABLE workout_exercises IS 'Tabela de junção N:M entre workouts e exercises';
COMMENT ON TABLE user_progress IS 'Histórico de execução de exercícios e métricas de progresso';
COMMENT ON TABLE user_achievements IS 'Sistema de gamificação com conquistas do usuário';

-- Índices para performance (opcional, podem ser omitidos na importação visual)
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
