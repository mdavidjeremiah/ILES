# Internship Logging and Evaluation System

Full-stack ILES application using Django REST, React, and Neon Postgres.

## Database

Production deployments require Neon Postgres. Local debug runs can fall back to SQLite when `NEON_DATABASE_URL` is not set, but Render must have `NEON_DATABASE_URL` configured.

Create a Neon project, open **Connect**, copy the Neon Postgres connection string, and set it as `NEON_DATABASE_URL`.
The URL should look like:

```text
postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require
```

For hosted/serverless deployments, Neon recommends the pooled connection string when your app can create many concurrent connections.

## Deployment

The backend deploys to Render from `render.yaml`. Set `NEON_DATABASE_URL` in Render before deploying.

The frontend deploys to Vercel from the repository root. `vercel.json` builds `frontend/` and proxies `/api/*` to the Render backend. If the Render service URL changes, update the rewrite destination in `vercel.json`.

## Backend

```powershell
cd backend
$env:NEON_DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 127.0.0.1:8000
```

API root: `http://127.0.0.1:8000/api/`

## Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5174
```

App URL: `http://127.0.0.1:5174/`

Sign up first, then sign in with the created account. Account records are stored in Neon through Django.
