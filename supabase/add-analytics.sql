create table if not exists public.analytics_page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  referrer_host text,
  visitor_id text,
  session_id text,
  country text,
  region text,
  city text,
  device_type text not null default 'unknown',
  browser text not null default 'unknown',
  os text not null default 'unknown',
  visited_at timestamptz not null default now()
);

alter table public.analytics_page_views
add column if not exists visitor_id text,
add column if not exists session_id text;

create index if not exists analytics_page_views_visited_at_idx
on public.analytics_page_views (visited_at desc);

create index if not exists analytics_page_views_path_idx
on public.analytics_page_views (path);

create index if not exists analytics_page_views_visitor_id_idx
on public.analytics_page_views (visitor_id);

create index if not exists analytics_page_views_session_id_idx
on public.analytics_page_views (session_id);

alter table public.analytics_page_views enable row level security;

drop policy if exists "Anyone can record page views" on public.analytics_page_views;
create policy "Anyone can record page views"
on public.analytics_page_views for insert
with check (true);

drop policy if exists "Admins read analytics page views" on public.analytics_page_views;
create policy "Admins read analytics page views"
on public.analytics_page_views for select
using (public.is_admin());
