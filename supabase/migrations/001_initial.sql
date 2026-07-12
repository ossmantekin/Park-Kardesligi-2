create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  level text not null default 'beginner',
  goal text,
  daily_minutes integer not null default 15 check (daily_minutes between 5 and 180),
  xp integer not null default 0,
  streak integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  sort_order integer not null,
  duration_minutes integer not null default 10,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  best_score integer check (best_score between 0 and 100),
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  duration_seconds integer not null default 0,
  correct_notes integer not null default 0,
  incorrect_notes integer not null default 0,
  accuracy numeric(5,2),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists idx_lessons_sort on public.lessons(sort_order);
create index if not exists idx_sessions_user_started on public.practice_sessions(user_id, started_at desc);

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.practice_sessions enable row level security;

create policy "profiles_self" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "lessons_public_read" on public.lessons for select using (is_published = true);
create policy "progress_self" on public.user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_self" on public.practice_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.lessons (slug, title, description, sort_order, duration_minutes, is_published) values
('klavyeyi-tani','Piyano Klavyesini Tanı','İkili ve üçlü siyah tuş grupları ile Do notasını öğren.',1,8,true),
('parmak-numaralari','Parmak Numaraları','Sağ ve sol el parmak numaralarını öğren.',2,7,true),
('ilk-bes-nota','İlk Beş Nota','Do, Re, Mi, Fa, Sol notalarını öğren.',3,10,true),
('ilk-ritim','İlk Ritim','Dörtlük ve ikilik nota ile metronom çalış.',4,9,true),
('ilk-sarki','İlk Şarkı','Basit bir kamu malı melodiyi performans modunda çal.',5,12,true)
on conflict (slug) do nothing;
