# 🐾 Mascotas App — TP Integrador

**Programación Web Dinámica · 6° 1° · EPET N° 30 · 2026**

## Tema

Registro de **mascotas** y sus vacunas. Cada mascota tiene:

| Campo            | Tipo     | Ejemplo      |
| ---------------- | -------- | ------------ |
| `nombre`         | texto    | Tristán      |
| `especie`        | texto    | perro        |
| `edad`           | número   | 7            |
| `vacunada`       | booleano | true         |
| `proxima_vacuna` | fecha    | 2026-12-21   |

## Estructura

```
mi-proyecto/
├── api/        API REST en Laravel (SQLite)
├── web/        Frontend en Next.js + PWA
└── README.md
```

## Requisitos

- PHP 8.2 o superior y Composer
- Node.js 20 o superior y npm

## Cómo correr el proyecto

Se necesitan **dos terminales**: una para la API y otra para el frontend.

### 1. API (Laravel)

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php -r "touch('database/database.sqlite');"
php artisan migrate --seed
php artisan serve
```

> En Windows con CMD, en lugar de `cp` usar `copy .env.example .env`.

- `php -r "touch(...)"` crea el archivo vacío de la base de datos SQLite.
- `migrate --seed` crea las tablas y carga **5 mascotas de ejemplo**.
- La API queda en **http://127.0.0.1:8000/api/mascotas**.

### 2. Frontend (Next.js)

En otra terminal:

```bash
cd web
npm install
npm run build
npm run start
```

La app queda en **http://localhost:3000**.

> Se usa `build` + `start` (modo producción) para que el Service Worker funcione igual que en una app publicada. Para desarrollar también se puede usar `npm run dev`.

**Si la API corre en otro puerto** (por ejemplo, porque el 8000 está ocupado): iniciarla con `php artisan serve --port=8001` y crear el archivo `web/.env.local` con esta línea (hay un ejemplo en `web/.env.example`):

```
API_URL=http://127.0.0.1:8001/api
```

Después volver a correr `npm run build` y `npm run start`.

### 3. Probar la PWA

1. Abrir http://localhost:3000 en Chrome y recorrer el listado y algún detalle.
2. **Instalar:** usar el ícono de instalar en la barra de direcciones (o menú ⋮ → "Instalar Mascotas App").
3. **Offline:** DevTools (F12) → pestaña *Application* → *Service Workers* → tildar **Offline** y recargar. El listado y los detalles que ya se visitaron se siguen viendo. Una página que no se visitó muestra la pantalla propia de "Estás sin conexión".

## Endpoints de la API

| Método | Ruta                    | Qué hace               | Respuesta OK |
| ------ | ----------------------- | ---------------------- | ------------ |
| GET    | `/api/mascotas`         | Lista todas            | 200          |
| GET    | `/api/mascotas/{id}`    | Muestra una            | 200          |
| POST   | `/api/mascotas`         | Crea una               | 201          |
| PUT    | `/api/mascotas/{id}`    | Actualiza una          | 200          |
| DELETE | `/api/mascotas/{id}`    | Borra una              | 200          |

Si el id no existe se responde **404** (`findOrFail`). Si los datos no son válidos se responde **422** con los mensajes de error en castellano.

## Pruebas en Thunder Client

Todas las peticiones con el header `Accept: application/json`. Cuerpo válido usado en POST y PUT:

```json
{ "nombre": "Toby", "especie": "perro", "edad": 2, "vacunada": true, "proxima_vacuna": "2027-01-10" }
```

| #  | Petición                                         | Código esperado | Código obtenido |
| -- | ------------------------------------------------ | --------------- | --------------- |
| 1  | GET `/api/mascotas`                              | 200             | 200             |
| 2  | GET `/api/mascotas/1`                            | 200             | 200             |
| 3  | GET `/api/mascotas/999` (no existe)              | 404             | 404             |
| 4  | POST `/api/mascotas` con datos válidos           | 201             | 201             |
| 5  | POST `/api/mascotas` con `nombre` vacío y `edad: "abc"` | 422      | 422             |
| 6  | PUT `/api/mascotas/6` con datos válidos          | 200             | 200             |
| 7  | PUT `/api/mascotas/999` (no existe)              | 404             | 404             |
| 8  | PUT `/api/mascotas/6` con `edad: -1`             | 422             | 422             |
| 9  | DELETE `/api/mascotas/6`                         | 200             | 200             |
| 10 | DELETE `/api/mascotas/6` otra vez (ya no existe) | 404             | 404             |

## Qué incluye

**Backend:** modelo `Mascota` con `$fillable` y `$casts`, migración, seeder con 5 registros, `Route::apiResource`, los 5 métodos del CRUD, validación con `$request->validate()` y mensajes en castellano.

**Frontend:**
- Listado en `/` tomado de la API.
- Detalle en `/mascotas/[id]`.
- Manejo de errores con `res.ok`: si la API está apagada o responde mal, se muestra un mensaje y la página no se rompe. Un id inexistente muestra "Mascota no encontrada".
- Layout con encabezado y navegación con `Link`.
- Client Component `BotonFavorito` con `'use client'` y `useState`.

**PWA:** `manifest.json` (nombre, íconos 192/512 y maskable, colores, `display: standalone`), Service Worker registrado e instalable, y funciona offline.

**Extras:**
- ✅ Formulario para **crear** con Server Action (`/mascotas/nueva`), que muestra los errores 422 debajo de cada campo.
- ✅ **Editar y borrar** desde el frontend.
- ✅ **Buscador** por nombre o especie en el listado.
- ✅ Página propia de **sin conexión** y caché **network-first**.

## Lo que no está / limitaciones

- La app no está publicada online ni empaquetada como TWA.
- El favorito es un estado del navegador (`useState`): no se guarda en la API y se pierde al recargar la página.
- Offline solo se ven las páginas que ya se visitaron con conexión. Crear, editar y borrar necesitan conexión, porque usan la API.

## Informe teórico

### 1. Códigos de estado

**404:** `GET /api/mascotas/999`. El controlador usa `Mascota::findOrFail($id)` y, como no hay ninguna mascota con ese id, Laravel corta y responde 404 "Not Found". Es el código correcto porque la ruta existe y la petición está bien hecha: lo que no existe es el recurso pedido. No es 500, porque el servidor no falló, ni 400, porque el pedido no tiene nada mal escrito.

**422:** `POST /api/mascotas` con `{"nombre": "", "edad": "abc"}`. El JSON llega bien formado, pero los datos no cumplen las reglas de `$request->validate()` (nombre obligatorio, edad entera, etc.). 422 "Unprocessable Content" significa justamente eso: "entendí el pedido, pero el contenido no es válido". No es 400, porque la sintaxis está bien, ni 404, porque no falta ningún recurso.

### 2. HTTPS

Con HTTP todo viaja en texto plano. Alguien en la misma red (por ejemplo, el Wi-Fi de la escuela) podría ver con un programa como Wireshark qué páginas abro y los datos de las mascotas que creo o edito, y hasta modificar las respuestas en el camino (ataque *man-in-the-middle*). HTTPS cifra la comunicación y verifica que el servidor sea quien dice ser. El Service Worker exige HTTPS porque se pone en el medio de **todas** las peticiones de la app y queda instalado en el navegador: si alguien pudiera inyectar un SW falso por HTTP, controlaría la app para siempre. La única excepción es `localhost`, por eso se puede probar en la computadora.

### 3. CORS

CORS es una regla **del navegador**: bloquea que el JavaScript de una página lea respuestas de otro origen (otro dominio o puerto) si ese servidor no lo permite. En mi app, el listado y el detalle se piden desde Server Components y el crear, editar y borrar usan Server Actions: el `fetch` lo hace el servidor de Next.js hacia Laravel, no el navegador, así que CORS no interviene. Aparecería si hiciera el `fetch` desde un Client Component (por ejemplo, si el botón de borrar llamara directo a `http://127.0.0.1:8000/api/mascotas/1` desde el navegador en `localhost:3000`). Ahí el origen es distinto por el puerto y Laravel tendría que responder con el header `Access-Control-Allow-Origin`.

### 4. PWA y TWA

No necesita estar en Google Play. Como PWA ya se puede instalar desde el navegador, tiene ícono propio, abre en pantalla completa (`standalone`) y funciona sin conexión gracias al Service Worker. Además, se actualiza sola cuando cambio el código, sin pasar por la revisión de una tienda. Una TWA solo convendría si quisiera que la gente la encuentre buscando en Play Store. Para una app de registro de mascotas personal o de una veterinaria chica, compartir el link alcanza.

### 5. Decisiones: qué me costó más

Lo que más me costó fue la PWA, porque cuando empecé a agregarla el código empezó a tener muchísimas fallas. El Service Worker a veces no se registraba, y en modo offline la app mostraba errores en vez de abrir. Lo fui resolviendo de a partes: primero me aseguré de que el SW se registrara y quedara activo en DevTools, y después cambié la caché a *network-first*. Así, con conexión siempre trae los datos nuevos de la API y sin conexión usa la copia guardada. Para las páginas que nunca se visitaron armé una pantalla propia de "Estás sin conexión". También aprendí que hay que probarla con `npm run build` y `npm run start`, porque en modo desarrollo se comporta distinto.
