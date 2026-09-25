-- GET public catalog v1: structural schema only. No data is inserted here.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  visual_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cities_slug_not_blank check (btrim(slug) <> ''),
  constraint cities_name_not_blank check (btrim(name) <> ''),
  constraint cities_title_not_blank check (btrim(title) <> ''),
  constraint cities_display_order_nonnegative check (display_order >= 0)
);

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  city_id uuid not null references public.cities(id) on delete restrict,
  slug text not null,
  name text not null,
  type text not null,
  logo_text text,
  plan text,
  slogan text,
  description text,
  address text,
  whatsapp text,
  website text,
  opening_hours text,
  hero_image_url text,
  media_label text,
  gallery jsonb not null default '[]'::jsonb,
  cities_label jsonb,
  display_order integer not null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  visual_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint institutions_city_slug_key unique (city_id, slug),
  constraint institutions_slug_not_blank check (btrim(slug) <> ''),
  constraint institutions_name_not_blank check (btrim(name) <> ''),
  constraint institutions_type_not_blank check (btrim(type) <> ''),
  constraint institutions_display_order_nonnegative check (display_order >= 0)
);

create table public.career_masters (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  slug text not null unique,
  name text not null,
  description text not null,
  graduate_profile text,
  work_field text,
  study_plan jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint career_masters_slug_not_blank check (btrim(slug) <> ''),
  constraint career_masters_name_not_blank check (btrim(name) <> ''),
  constraint career_masters_description_not_blank check (btrim(description) <> '')
);

create table public.academic_offerings (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  institution_id uuid not null references public.institutions(id) on delete restrict,
  career_master_id uuid not null references public.career_masters(id) on delete restrict,
  modality text,
  duration text,
  degree text,
  campus text,
  shifts text,
  national_validity text,
  image_url text,
  badge text,
  display_order integer not null,
  form_enabled boolean not null default true,
  whatsapp text,
  is_visible boolean not null default true,
  publication_status text not null default 'published',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_offerings_institution_career_key unique (institution_id, career_master_id),
  constraint academic_offerings_display_order_nonnegative check (display_order >= 0)
);

create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  slug text not null unique,
  name text not null,
  description text not null,
  profile text,
  work_field text,
  contents jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint training_programs_slug_not_blank check (btrim(slug) <> ''),
  constraint training_programs_name_not_blank check (btrim(name) <> ''),
  constraint training_programs_description_not_blank check (btrim(description) <> '')
);

create table public.training_offerings (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  institution_id uuid not null references public.institutions(id) on delete restrict,
  training_program_id uuid not null references public.training_programs(id) on delete restrict,
  modality text,
  duration text,
  certification text,
  campus text,
  shifts text,
  national_validity text,
  image_url text,
  badge text,
  display_order integer not null,
  form_enabled boolean not null default true,
  whatsapp text,
  is_visible boolean not null default true,
  publication_status text not null default 'published',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint training_offerings_institution_program_key unique (institution_id, training_program_id),
  constraint training_offerings_display_order_nonnegative check (display_order >= 0)
);

create index institutions_city_display_order_active_idx
  on public.institutions (city_id, display_order)
  where is_active;

create index academic_offerings_career_master_id_idx
  on public.academic_offerings (career_master_id);

create index academic_offerings_institution_display_order_visible_idx
  on public.academic_offerings (institution_id, display_order)
  where is_visible and publication_status = 'published';

create index training_offerings_training_program_id_idx
  on public.training_offerings (training_program_id);

create index training_offerings_institution_display_order_visible_idx
  on public.training_offerings (institution_id, display_order)
  where is_visible and publication_status = 'published';

create trigger cities_set_updated_at
before update on public.cities
for each row execute function public.set_updated_at();

create trigger institutions_set_updated_at
before update on public.institutions
for each row execute function public.set_updated_at();

create trigger career_masters_set_updated_at
before update on public.career_masters
for each row execute function public.set_updated_at();

create trigger academic_offerings_set_updated_at
before update on public.academic_offerings
for each row execute function public.set_updated_at();

create trigger training_programs_set_updated_at
before update on public.training_programs
for each row execute function public.set_updated_at();

create trigger training_offerings_set_updated_at
before update on public.training_offerings
for each row execute function public.set_updated_at();
