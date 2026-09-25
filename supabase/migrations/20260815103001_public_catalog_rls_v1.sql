-- GET public catalog v1: read-only public access. No write policy is created.

revoke all privileges on table
  public.cities,
  public.institutions,
  public.career_masters,
  public.academic_offerings,
  public.training_programs,
  public.training_offerings
from anon, authenticated;

grant select on table
  public.cities,
  public.institutions,
  public.career_masters,
  public.academic_offerings,
  public.training_programs,
  public.training_offerings
to anon, authenticated;

alter table public.cities enable row level security;
alter table public.institutions enable row level security;
alter table public.career_masters enable row level security;
alter table public.academic_offerings enable row level security;
alter table public.training_programs enable row level security;
alter table public.training_offerings enable row level security;

create policy "Public can read active cities"
on public.cities
for select
to anon, authenticated
using (is_active);

create policy "Public can read active institutions"
on public.institutions
for select
to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.cities
    where cities.id = institutions.city_id
      and cities.is_active
  )
);

create policy "Public can read published career masters"
on public.career_masters
for select
to anon, authenticated
using (is_active and status = 'published');

create policy "Public can read published academic offerings"
on public.academic_offerings
for select
to anon, authenticated
using (
  is_visible
  and publication_status = 'published'
  and exists (
    select 1
    from public.institutions
    join public.cities on cities.id = institutions.city_id
    where institutions.id = academic_offerings.institution_id
      and institutions.is_active
      and cities.is_active
  )
  and exists (
    select 1
    from public.career_masters
    where career_masters.id = academic_offerings.career_master_id
      and career_masters.is_active
      and career_masters.status = 'published'
  )
);

create policy "Public can read published training programs"
on public.training_programs
for select
to anon, authenticated
using (is_active and status = 'published');

create policy "Public can read published training offerings"
on public.training_offerings
for select
to anon, authenticated
using (
  is_visible
  and publication_status = 'published'
  and exists (
    select 1
    from public.institutions
    join public.cities on cities.id = institutions.city_id
    where institutions.id = training_offerings.institution_id
      and institutions.is_active
      and cities.is_active
  )
  and exists (
    select 1
    from public.training_programs
    where training_programs.id = training_offerings.training_program_id
      and training_programs.is_active
      and training_programs.status = 'published'
  )
);
