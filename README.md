# Invitación de Boda 🌿

Aplicación web completa para la invitación de una boda.

- **Frontend:** React (con Vite)
- **Backend:** Python + Django + Django REST Framework
- **Base de datos:** SQLite
- **Panel privado:** Django Admin en `/admin/`

```
React  →  Django REST API  →  SQLite        (invitados)

Django Admin  →  SQLite                     (administración)
```

---

## Estructura del proyecto

```
Invitacion_Boda/
├── invitacion.jpeg              # Imagen original de la invitación (no se toca)
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example             # Plantilla de variables de entorno
│   ├── db.sqlite3               # Base de datos (se crea con migrate)
│   ├── config/                  # Proyecto Django
│   │   ├── settings.py          # SECRET_KEY, DEBUG, CORS... desde .env
│   │   ├── urls.py              # /admin/ y /api/
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── rsvp/                    # App principal
│       ├── models.py            # Modelo Guest (name, attendance)
│       ├── serializers.py       # Validaciones
│       ├── views.py             # POST /api/rsvp/
│       ├── urls.py
│       ├── admin.py             # Panel de administración
│       └── migrations/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    ├── public/
    │   └── invitacion.jpeg      # Imagen servida por React
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── Invitation.jsx
        │   ├── RSVPForm.jsx
        │   └── ConfirmationMessage.jsx
        └── styles/
            └── global.css
```

---

## Requisitos

- Python 3.10 o superior
- Node.js 18 o superior (y npm)

---

## Puesta en marcha paso a paso

### 1. Clonar / abrir el proyecto

```bash
cd Invitacion_Boda
```

### 2. Crear el entorno virtual de Python (backend)

```bash
cd backend
python3 -m venv .venv
```

Actívalo:

**Linux / macOS:**

```bash
source .venv/bin/activate
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Instalar las dependencias de Python

Con el entorno virtual activado:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Esto instala **Django**, **Django REST Framework**, **django-cors-headers** y **python-dotenv**.

> Si prefieres instalarlas una a una:
> ```bash
> pip install django djangorestframework django-cors-headers python-dotenv
> ```

### 4. Configurar las variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Abre `.env` y ajusta los valores:

```env
SECRET_KEY=una-clave-larga-y-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

> En producción: `DEBUG=False` y una `SECRET_KEY` nueva.
> Para generar una clave: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
> **Nunca subas el archivo `.env` al repositorio.**

### 5. Ejecutar las migraciones

Sigue estando dentro de `backend/` con el entorno virtual activado:

```bash
python manage.py makemigrations
python manage.py migrate
```

Esto crea `backend/db.sqlite3` con la tabla `Guest`:

```
Guest
---------
id
name
attendance
```

### 6. Crear el usuario administrador

```bash
python manage.py createsuperuser
```

Sigue las indicaciones (usuario, correo y contraseña).

> Para pruebas locales ya existe un superusuario:
> **usuario:** `admin` · **contraseña:** `boda2026`
> Cámbialo o elimínalo antes de desplegar.

### 7. Iniciar Django (backend)

```bash
python manage.py runserver
```

El backend queda en: <http://localhost:8000>

- Panel privado: <http://localhost:8000/admin/>
- API: `POST http://localhost:8000/api/rsvp/`

### 8. Instalar las dependencias de React (frontend)

Abre **otra terminal**:

```bash
cd frontend
npm install
```

Copia también las variables de entorno del frontend:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8000
```

### 9. Iniciar React (frontend)

```bash
npm run dev
```

La invitación queda en: <http://localhost:5173>

---

## Cómo probar la aplicación

### A. La página de invitación (invitado)

1. Abre <http://localhost:5173>.
2. Verás la imagen `invitacion.jpeg`.
3. Escribe tu nombre.
4. Elige **"Sí, asistiré"** o **"No podré asistir"**.
5. Pulsa **Enviar**.
6. Aparecerá el mensaje de confirmación.

Prueba también enviar con el nombre vacío o sin elegir opción: mostrará un aviso.

### B. Probar el endpoint con curl

**Confirmar asistencia (SÍ):**

```bash
curl -X POST http://localhost:8000/api/rsvp/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "attendance": true}'
```

**No asistirá:**

```bash
curl -X POST http://localhost:8000/api/rsvp/ \
  -H "Content-Type: application/json" \
  -d '{"name": "María González", "attendance": false}'
```

Respuesta correcta: `201 Created`

```json
{"message": "Respuesta registrada correctamente."}
```

**Datos inválidos → `400 Bad Request`:**

```bash
# Nombre vacío
curl -X POST http://localhost:8000/api/rsvp/ \
  -H "Content-Type: application/json" \
  -d '{"name": "   ", "attendance": true}'

# attendance ausente o no booleano
curl -X POST http://localhost:8000/api/rsvp/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana"}'
```

### C. Comprobar que NO hay API pública de invitados

```bash
curl -i http://localhost:8000/api/rsvp/     # 405 Method Not Allowed
curl -i http://localhost:8000/api/guests/   # 404 Not Found
```

La única forma de leer la lista de invitados es **Django Admin**.

### D. Django Admin (solo administradores)

1. Abre <http://localhost:8000/admin/>.
2. Inicia sesión con el superusuario del paso 6.
3. Entra en **Confirmaciones de asistencia → Invitados**.
4. Verás:

```
Nombre             Asistencia
--------------------------------
Juan Pérez         Sí
María González     Sí
Carlos Rodríguez   No
```

Puedes **buscar por nombre** y **filtrar por asistencia**.

Si abres `/admin/` en una ventana anónima, Django te redirige al login:
los invitados no pueden acceder.

---

## API

| Método | Ruta             | Acceso    | Descripción                          |
| ------ | ---------------- | --------- | ------------------------------------ |
| `POST` | `/api/rsvp/`     | Público   | Guarda la respuesta de un invitado   |
| —      | `/api/guests/`   | **No existe** | La lista nunca se expone públicamente |
| —      | `/admin/`        | Privado   | Django Admin (usuario y contraseña)  |

**Petición:**

```json
{ "name": "Juan Pérez", "attendance": true }
```

**Respuesta:** `201 Created`

```json
{ "message": "Respuesta registrada correctamente." }
```

### Seguridad implementada

- Autenticación de Django para `/admin/` (URL estándar, no secreta).
- CSRF activo en todo el proyecto (protege el admin).
- CORS restringido a los orígenes de `CORS_ALLOWED_ORIGINS`.
- Validación de datos en el serializer (nombre no vacío, `attendance` booleano).
- El endpoint público **solo admite `POST`**: `GET`, `PUT`, `PATCH` y `DELETE` devuelven `405`.
- No existe ningún endpoint público que devuelva la lista de invitados.
- `SECRET_KEY`, `DEBUG` y orígenes en variables de entorno (nunca en el código).

---

## Despliegue (más adelante)

Ideas generales cuando toque publicarlo:

1. **Backend:** sube `backend/` a un proveedor WSGI (Railway, Render, Fly.io, un VPS con Gunicorn + Nginx...).
2. Instala dependencias: `pip install -r requirements.txt`.
3. Crea un `.env` con `DEBUG=False`, `SECRET_KEY` real, dominio en `ALLOWED_HOSTS` y el origen del frontend en `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS`.
4. Ejecuta `python manage.py migrate` y `python manage.py createsuperuser`.
5. Recoge estáticos: `python manage.py collectstatic`.
6. **Frontend:** `npm run build` genera la carpeta `dist/`, que puedes servir en Vercel, Netlify o Nginx.
7. Apunta `VITE_API_URL` al dominio de tu backend **antes de hacer el build**.

---

## Solución de problemas

| Problema | Solución |
| -------- | -------- |
| `ModuleNotFoundError: No module named 'django'` | No tienes activado el entorno virtual: `source .venv/bin/activate` |
| `CORS error` en el navegador | Revisa `CORS_ALLOWED_ORIGINS` en `backend/.env` (sin barra final) y reinicia Django |
| `Failed to fetch` en el formulario | Django no está arrancado, o `VITE_API_URL` en `frontend/.env` es incorrecto (reinicia `npm run dev`) |
| `no such table: rsvp_guest` | Faltan migraciones: `python manage.py migrate` |
| Imagen no visible | Comprueba que `frontend/public/invitacion.jpeg` existe |
