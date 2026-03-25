# Puesta en marcha — Auth + Quiniela

## 1. Crear la base de datos en XAMPP

Abre phpMyAdmin y crea la base de datos vacía:

```sql
CREATE DATABASE liga_batcarallo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Las tablas se crean automáticamente al ejecutar el setup del paso 3.

## 2. Revisar .env.local

El fichero ya existe en la raíz del proyecto. Por defecto apunta a MySQL de XAMPP sin contraseña:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=liga_batcarallo
SESSION_SECRET=batcarallo-secret-key-2025-gotham
```

Cambia `SESSION_SECRET` por una cadena aleatoria larga antes de usar en producción.
Si tu MySQL tiene contraseña, rellena `DB_PASSWORD`.

## 3. Crear usuarios (una sola vez)

Con el servidor corriendo (`npm run dev`), ejecuta:

```bash
curl -X POST http://localhost:3000/api/setup
```

O desde las DevTools del navegador:
```js
fetch('/api/setup', { method: 'POST' }).then(r => r.json()).then(console.log)
```

Crea todos los miembros con **contraseña por defecto: `batcarallo`**.
El endpoint devuelve la lista de usernames creados y falla con 409 si ya existen.

### Usernames generados

Los nombres con tildes o espacios se transforman así:
- `aaron` → aaron (es admin de página)
- `david` → david
- `angel` → angel
- `paco` → paco
- `melo` → melo
- etc.

Los dos "Antonio" se resuelven como `antonio1` (primera) y `antonio2` (segunda).
Los "Vacante" no se crean.

## 4. Acceder

- Página de login: `/login`
- Panel admin (solo Aarón): `/admin/quiniela`
- Quiniela: `/quiniela`

## Flujo de una jornada

1. **Aarón crea la jornada** en `/admin/quiniela` → pestaña "Nueva jornada"
   - Número de jornada, fecha, plazo de pronósticos
   - 2 partidos simples + 1 partido de jornada

2. **Los miembros envían su pronóstico** en `/quiniela/[id]`
   - Solo pueden enviar antes del plazo
   - Una vez enviado, no se puede modificar

3. **Aarón entra los resultados** en `/admin/quiniela` → pestaña "Entrar resultados"
   - Selecciona 1/X/2 para cada partido
   - El sistema calcula los puntos automáticamente:
     - 1 simple acertado → 20 pts
     - 2 simples → 50 pts
     - 2 simples + partido de jornada → 100 pts

4. **Rankings actualizados solos** en `/quiniela`:
   - Ranking del mes actual
   - Pichichi de temporada

## Rutas

| Ruta | Acceso |
|---|---|
| `/login` | Todos |
| `/quiniela` | Miembros logueados |
| `/quiniela/[id]` | Miembros logueados |
| `/admin/quiniela` | Solo Aarón |
