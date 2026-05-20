# Internship Logging and Evaluation System

Full-stack ILES application using Django REST, React, and PostgreSQL.

## PostgreSQL

The app is PostgreSQL-only. It does not use SQLite.

For this Windows workspace, start the bundled local PostgreSQL data directory:

```powershell
.\scripts\start-local-postgres.ps1
```

That starts PostgreSQL on `127.0.0.1:55432` and creates the `iles` database.

For an existing PostgreSQL server, set these environment variables instead:

```powershell
$env:POSTGRES_DB="iles"
$env:POSTGRES_TEST_DB="test_iles"
$env:POSTGRES_USER="postgres"
$env:POSTGRES_PASSWORD="your-password"
$env:POSTGRES_HOST="127.0.0.1"
$env:POSTGRES_PORT="5432"
```

## Backend

```powershell
cd backend
$env:POSTGRES_PORT="55432"
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

The demo login accepts the prefilled credentials and loads seeded internship data.
