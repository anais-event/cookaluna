create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  language text not null default 'fr',
  source text not null default 'coming_soon',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

comment on table public.subscribers is 'Newsletter / waitlist subscribers for Cookaluna';

alter table public.subscribers enable row level security;

create policy "Service role can manage subscribers"
  on public.subscribers
  for all
  using (true)
  with check (true);

create policy "Anon can insert subscribers"
  on public.subscribers
  for insert
  with check (true);
