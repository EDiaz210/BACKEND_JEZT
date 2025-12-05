# Backend – WhatsApp Web (Desarrollo)

Buenas prácticas y pautas para desarrollar con `whatsapp-web.js` en Windows.

- Autenticación: usa `LocalAuth` con `dataPath` `.wwebjs_auth` y `clientId` estable (ej. `wa3`). Evita `RemoteAuth` en desarrollo: las recargas constantes comprimen/suben/restauran la sesión y pueden romper el flujo.
- Nodemon: ignora carpetas de sesión para evitar reinicios por cambios:
  - Ignorar: `.wwebjs_auth`, `.wwebjs_cache`, `logs`, `maps`, `session`, `node_modules`.
- Guardias contra LOGOUT: si `disconnected` llega con `LOGOUT` durante sincronización inicial, no reinicies automáticamente. Espera una ventana (120–180s) y reinicia manualmente si hace falta.
- Navegador: en Windows, usa `headless:false` y `executablePath` de Chrome. Evita múltiples instancias del cliente.
- Limpieza segura: para borrar sesión, usa reintentos (`rmMaxRetries`) por posibles bloqueos `EBUSY`.
- Endpoints de control: 
  - `GET /whats/status` → `{ ready, state }`
  - `GET /whats/debug` → `{ ready, hasClient, flags, state }`
  - `POST /whats/start` y `POST /whats/restart` para controlar el ciclo de vida.

Comandos útiles (PowerShell):

```powershell
# Estado rápido
Invoke-RestMethod -Method GET -Uri http://localhost:PORT/whats/status

# Diagnóstico detallado
Invoke-RestMethod -Method GET -Uri http://localhost:PORT/whats/debug

# Iniciar cliente manualmente
Invoke-RestMethod -Method POST -Uri http://localhost:PORT/whats/start

# Reiniciar cliente
Invoke-RestMethod -Method POST -Uri http://localhost:PORT/whats/restart
```

Si ves cierres inmediatos tras `ready` con razón `LOGOUT`, espera la ventana de guardia y luego usa `/whats/restart`. Verifica también que el teléfono no esté cerrando la sesión por conflicto de dispositivos.
