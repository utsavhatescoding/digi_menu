create table if not exists public.menus (
  slug text primary key,
  business_name text not null,
  currency text not null default 'NPR',
  phone text not null default '',
  whatsapp text not null default '',
  maps_url text not null default '',
  menu_json jsonb not null,
  published_at timestamptz not null default now()
);

alter table public.menus enable row level security;

-- Public customer pages can read published menus. Writes happen only through
-- the server using the private service-role key.
create policy "Published menus are publicly readable"
on public.menus for select
to anon
using (true);
