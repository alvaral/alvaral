create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  cover_image_url text,
  cover_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_translations (
  post_id uuid not null references public.posts(id) on delete cascade,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  description text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (post_id, locale)
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  image_url text not null,
  alt_es text,
  alt_en text,
  caption_es text,
  caption_en text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_profile (
  id boolean primary key default true check (id),
  image_path text,
  image_url text not null default '/assets/images/profile-photo.webp',
  title_es text not null default 'Sobre mí',
  title_en text not null default 'About Me',
  intro_es text not null default '¡Hola! Soy Álvaro Alonso, ingeniero de software con pasión por crear experiencias digitales útiles y agradables.',
  intro_en text not null default 'Hi! I''m Álvaro Alonso, a software engineer passionate about creating unique and functional digital experiences.',
  body_es text not null default 'Me encanta aprender nuevas herramientas y mejorar continuamente mis habilidades para ofrecer soluciones de alta calidad. Siempre busco combinar creatividad y eficiencia en mis proyectos.',
  body_en text not null default 'I love learning new tools and constantly improving my skills to deliver high-quality solutions. I always seek to combine creativity and efficiency in my projects.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  referrer_host text,
  locale text check (locale in ('en', 'es')),
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

create index if not exists analytics_page_views_visited_at_idx
on public.analytics_page_views (visited_at desc);

create index if not exists analytics_page_views_path_idx
on public.analytics_page_views (path);

create index if not exists analytics_page_views_locale_idx
on public.analytics_page_views (locale);

create index if not exists analytics_page_views_visitor_id_idx
on public.analytics_page_views (visitor_id);

create index if not exists analytics_page_views_session_id_idx
on public.analytics_page_views (session_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists post_translations_set_updated_at on public.post_translations;
create trigger post_translations_set_updated_at
before update on public.post_translations
for each row execute function public.set_updated_at();

drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at
before update on public.photos
for each row execute function public.set_updated_at();

drop trigger if exists about_profile_set_updated_at on public.about_profile;
create trigger about_profile_set_updated_at
before update on public.about_profile
for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
alter table public.post_translations enable row level security;
alter table public.photos enable row level security;
alter table public.about_profile enable row level security;
alter table public.analytics_page_views enable row level security;

drop policy if exists "Published posts are public" on public.posts;
create policy "Published posts are public"
on public.posts for select
using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage posts" on public.posts;
create policy "Admins manage posts"
on public.posts for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published translations are public" on public.post_translations;
create policy "Published translations are public"
on public.post_translations for select
using (
  exists (
    select 1
    from public.posts
    where posts.id = post_translations.post_id
      and (posts.status = 'published' or public.is_admin())
  )
);

drop policy if exists "Admins manage post translations" on public.post_translations;
create policy "Admins manage post translations"
on public.post_translations for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Visible photos are public" on public.photos;
create policy "Visible photos are public"
on public.photos for select
using (visible = true or public.is_admin());

drop policy if exists "Admins manage photos" on public.photos;
create policy "Admins manage photos"
on public.photos for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "About profile is public" on public.about_profile;
create policy "About profile is public"
on public.about_profile for select
using (true);

drop policy if exists "Admins manage about profile" on public.about_profile;
create policy "Admins manage about profile"
on public.about_profile for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can record page views" on public.analytics_page_views;
create policy "Anyone can record page views"
on public.analytics_page_views for insert
with check (true);

drop policy if exists "Admins read analytics page views" on public.analytics_page_views;
create policy "Admins read analytics page views"
on public.analytics_page_views for select
using (public.is_admin());

insert into public.about_profile (id)
values (true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "Public media read" on storage.objects;
create policy "Public media read"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media"
on storage.objects for insert
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media"
on storage.objects for update
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media"
on storage.objects for delete
using (bucket_id = 'media' and public.is_admin());
