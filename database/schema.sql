-- Lodestar Safety & Case Management Platform
-- Run this in Supabase SQL editor (project: prachack)

create extension if not exists "pgcrypto";

-- USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('staff', 'supervisor', 'admin')),
  phone text,
  created_at timestamptz not null default now()
);

-- CLIENTS
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  address text,
  diagnosis_category text,
  assigned_staff_id uuid references users(id),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

-- VISITS
create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references users(id),
  client_id uuid not null references clients(id),
  checkin_time timestamptz not null default now(),
  checkout_time timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'alert')),
  notes text,
  created_at timestamptz not null default now()
);

-- ALERTS
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visits(id),
  staff_id uuid not null references users(id),
  alert_type text not null,
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- CASE NOTES
create table if not exists case_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  staff_id uuid not null references users(id),
  note text not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_visits_staff on visits(staff_id);
create index if not exists idx_visits_client on visits(client_id);
create index if not exists idx_visits_active on visits(checkout_time) where checkout_time is null;
create index if not exists idx_alerts_resolved on alerts(resolved) where resolved = false;
create index if not exists idx_case_notes_client on case_notes(client_id);
create index if not exists idx_clients_assigned_staff on clients(assigned_staff_id);
