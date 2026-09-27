# Lodestar Safety & Case Management Platform

Practice project for JPMorgan Code for Good Hackathon (Oct 16).

Employee safety and case management platform for Lodestar Children's Services —
automates check-in/check-out for home visits, alerts supervisors when a staff
member misses checkout, and centralizes client case management.

## Stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL) + Supabase Auth
- Deploy: Railway (backend), Vercel (frontend)

## Structure

```
/backend      Express API (routes, controllers, middleware)
/frontend     React app
/database     SQL schema + migrations
```

## Branches

- `main` — protected, merge only when feature done
- `frontend` — React work
- `backend` — API work
- `database` — schema/migrations

## Setup

See `backend/.env.example` for required environment variables.
