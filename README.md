# FerreGest · Catálogo e inventario

Proyecto del Grupo #2 (Programación III, ITLA) para la asignación **Scrum Poker y Sprint Planning**.
Incremento funcional del Sprint 1: **CRUD de artículos + consulta de existencias por almacén** (EP-01).

**Stack:** React (Vite) · NestJS · PostgreSQL (TypeORM) · Docker Compose para la base de datos.

## Requisitos
Node.js 18+ y Docker (o un PostgreSQL local con los datos de `backend/.env.example`).

## Cómo ejecutarlo
```bash
# 1. Base de datos
docker compose up -d

# 2. Backend  → http://localhost:3000/api
cd backend
cp .env.example .env
npm install
npm run start:dev          # al iniciar crea las tablas y carga 3 almacenes y 3 artículos de ejemplo
npm test                   # pruebas unitarias

# 3. Frontend → http://localhost:5173
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

## API
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/articulos?q=&inactivos=` | Listar y buscar por nombre o código de barras |
| GET | `/api/articulos/:id` | Ver un artículo |
| POST | `/api/articulos` | Crear |
| PUT | `/api/articulos/:id` | Editar |
| DELETE | `/api/articulos/:id` | Desactivar (eliminación lógica) |
| GET | `/api/almacenes` | Listar almacenes |
| GET | `/api/articulos/:id/existencias` | Existencia por almacén y total (HU-01) |
| PUT | `/api/articulos/:id/existencias/:almacenId` | Ajustar existencia en un almacén |

Ejemplo de creación:
```json
POST /api/articulos
{ "codigoBarras": "7460001000042", "nombre": "Martillo 16 oz", "unidad": "Unidad", "precioVenta": 450, "costo": 300 }
```

## Estructura
```
backend/   API NestJS (articulos, existencias, seed, pruebas)
frontend/  Interfaz React
docs/      Backlog para Jira, Daily, guía del Scrum Poker y guiones de video
```

## Fuera del alcance de este sprint
Tiempo real (WebSocket), app móvil, e-CF, impresión de recibos, POS completo. Quedan en el Product Backlog.
