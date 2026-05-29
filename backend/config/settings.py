from pathlib import Path
import warnings
from django.core.exceptions import ImproperlyConfigured

from .env import database_from_url, env, env_bool, env_list, load_env_file


BASE_DIR = Path(__file__).resolve().parent.parent
load_env_file(BASE_DIR.parent / ".env")
load_env_file(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY", "dev-only-internship-logging-secret-key")
DEBUG = env_bool("DJANGO_DEBUG", True)

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", ["localhost", "127.0.0.1", "testserver"])

INSTALLED_APPS = [
    "corsheaders",
    "rest_framework",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "internships",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASE_URL = env("NEON_DATABASE_URL") or env("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {
        "default": database_from_url(
            DATABASE_URL, conn_max_age=int(env("DATABASE_CONN_MAX_AGE", "60"))
        )
    }
else:
    if DEBUG:
        warnings.warn(
            "NEON_DATABASE_URL not set — falling back to SQLite for development.",
            RuntimeWarning,
        )
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": str(BASE_DIR / "db.sqlite3"),
            }
        }
    else:
        raise ImproperlyConfigured(
            "Set NEON_DATABASE_URL or DATABASE_URL to your Neon Postgres connection string. "
            "Example: postgresql://user:password@ep-example.region.aws.neon.tech/neondb?sslmode=require"
        )

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("DJANGO_TIME_ZONE", "Africa/Nairobi")
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://vercel.com/muwanguzi-david-jeremiahs-projects/iles-d4ub/9Q4nDFyuxsJiyKyA9bGatUQ9Rsbv",
    ],
)

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_PAGINATION_CLASS": None,
}
