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

drop trigger if exists about_profile_set_updated_at on public.about_profile;
create trigger about_profile_set_updated_at
before update on public.about_profile
for each row execute function public.set_updated_at();

alter table public.about_profile enable row level security;

drop policy if exists "About profile is public" on public.about_profile;
create policy "About profile is public"
on public.about_profile for select
using (true);

drop policy if exists "Admins manage about profile" on public.about_profile;
create policy "Admins manage about profile"
on public.about_profile for all
using (public.is_admin())
with check (public.is_admin());

insert into public.about_profile (id)
values (true)
on conflict (id) do nothing;
