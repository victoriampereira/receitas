-- Receitas: banco de dados (já aplicado no projeto do Casa Nova)
create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titulo text not null,
  foto text,
  tempo text,
  porcoes text,
  video_url text,
  ingredientes jsonb not null default '[]'::jsonb,
  passos jsonb not null default '[]'::jsonb,
  dica text,
  exemplo boolean not null default false,
  criada_em timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists receitas_user_idx on public.receitas(user_id, criada_em desc);
alter table public.receitas enable row level security;
create policy "receitas: dono le" on public.receitas for select to authenticated using ((select auth.uid()) = user_id);
create policy "receitas: dono cria" on public.receitas for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "receitas: dono altera" on public.receitas for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "receitas: dono apaga" on public.receitas for delete to authenticated using ((select auth.uid()) = user_id);
do $$ begin
  alter publication supabase_realtime add table public.receitas;
exception when duplicate_object then null; end $$;
