-- GET Cursos Docentes v1: standalone provincial catalog.
-- This domain is intentionally independent from institutional training programs/offerings.

create table public.teacher_courses (
  id uuid primary key default gen_random_uuid(),
  legacy_key text not null unique,
  slug text not null unique,
  title text not null,
  institution_name text not null,
  city_name text not null,
  modality text not null,
  score integer not null,
  duration_weeks integer not null,
  start_date date not null,
  status text not null,
  badge text not null,
  urgency text not null,
  image_url text not null,
  is_featured boolean not null default false,
  display_order integer not null,
  publication_status text not null default 'draft',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_courses_legacy_key_not_blank check (btrim(legacy_key) <> ''),
  constraint teacher_courses_slug_not_blank check (btrim(slug) <> ''),
  constraint teacher_courses_title_not_blank check (btrim(title) <> ''),
  constraint teacher_courses_institution_name_not_blank check (btrim(institution_name) <> ''),
  constraint teacher_courses_city_name_not_blank check (btrim(city_name) <> ''),
  constraint teacher_courses_modality_allowed check (modality in ('Presencial', 'Virtual', 'Mixta')),
  constraint teacher_courses_score_nonnegative check (score >= 0),
  constraint teacher_courses_duration_weeks_positive check (duration_weeks > 0),
  constraint teacher_courses_status_not_blank check (btrim(status) <> ''),
  constraint teacher_courses_badge_not_blank check (btrim(badge) <> ''),
  constraint teacher_courses_urgency_not_blank check (btrim(urgency) <> ''),
  constraint teacher_courses_image_url_not_blank check (btrim(image_url) <> ''),
  constraint teacher_courses_display_order_positive check (display_order > 0),
  constraint teacher_courses_publication_status_allowed check (publication_status in ('draft', 'published'))
);

create index teacher_courses_public_catalog_order_idx
  on public.teacher_courses (display_order)
  where is_active and publication_status = 'published';

create index teacher_courses_start_date_idx
  on public.teacher_courses (start_date, display_order)
  where is_active and publication_status = 'published';

create trigger teacher_courses_set_updated_at
before update on public.teacher_courses
for each row execute function public.set_updated_at();

revoke all privileges on table public.teacher_courses from anon, authenticated;
grant select on table public.teacher_courses to anon, authenticated;

alter table public.teacher_courses enable row level security;

create policy "Public can read published teacher courses"
on public.teacher_courses
for select
to anon, authenticated
using (is_active and publication_status = 'published');
