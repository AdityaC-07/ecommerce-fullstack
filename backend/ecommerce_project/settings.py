"""
Django settings for ecommerce_project.
"""

from pathlib import Path
import os

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-CHANGE_THIS_TO_A_RANDOM_SECRET_KEY'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# ------------------------------
# Application definition
# ------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework', # Django REST Framework
    # Your app
    'store',
    'corsheaders', 

]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✅ MOVED TO TOP - This is the key change!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ecommerce_project.urls'

# ------------------------------
# Templates
# ------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Leave this empty unless you want global templates outside apps
        'DIRS': [],
        'APP_DIRS': True,   # ✅ Important: allows Django to find app/templates
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ecommerce_project.wsgi.application'


# ------------------------------
# Database
# ------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ------------------------------
# Password validation
# ------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ------------------------------
# CORS Settings
# ------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    
]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    
]
CORS_ALLOW_CREDENTIALS = True

# ------------------------------
# Session Settings (ADDED FOR AUTH)
# ------------------------------
SESSION_COOKIE_SAMESITE = 'Lax'  # ✅ Changed from None
SESSION_COOKIE_SECURE = False   # ✅ NEW: Set to True in production with HTTPS
SESSION_COOKIE_HTTPONLY = True  # ✅ NEW: Prevents JavaScript access to session cookie
SESSION_COOKIE_DOMAIN = None
SESSION_COOKIE_NAME = 'sessionid'

# Allowed hosts
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
# ------------------------------
# Internationalization
# ------------------------------
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# ------------------------------
# Static files (CSS, JavaScript, Images)
# ------------------------------
STATIC_URL = '/static/'
# During development, you can place a project-level static folder:
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# For collectstatic (production), set STATIC_ROOT
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files (user uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'