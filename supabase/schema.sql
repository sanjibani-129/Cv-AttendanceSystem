-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll_no text not null unique,
  email text not null unique,
  descriptor jsonb not null,        -- 128-length face-api.js descriptor, stored as a JSON array
  created_at timestamptz not null default now()
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  check_in timestamptz not null default now(),
  check_out timestamptz,
  confidence numeric(5, 2),         -- match confidence % at check-in time
  session_date date not null default current_date
);

create index if not exists attendance_member_id_idx on attendance (member_id);
create index if not exists attendance_session_date_idx on attendance (session_date);

-- One open (no check_out) session per member at a time
create unique index if not exists attendance_one_open_session
  on attendance (member_id)
  where check_out is null;

-- Convenience view: total logged hours + latest status per member
create or replace view member_stats as
select
  m.id,
  m.name,
  m.roll_no,
  m.email,
  coalesce(sum(
    extract(epoch from (coalesce(a.check_out, now()) - a.check_in)) / 3600.0
  ), 0)::numeric(10, 1) as hours,
  bool_or(a.check_out is null) as is_inside
from members m
left join attendance a on a.member_id = m.id
group by m.id, m.name, m.roll_no, m.email;

-- Row Level Security: enabled, but reads/writes are handled through the
-- Next.js API routes using the service-role key, so no public policies
-- are added here on purpose.
alter table members enable row level security;
alter table attendance enable row level security;
