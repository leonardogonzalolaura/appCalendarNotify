# Configuración del Backend y Google Login

## 1. Configuración Local
Para probar el servidor localmente:
1. Entra a la carpeta `server`: `cd server`
2. Instala dependencias: `npm install`
3. Crea un archivo `.env` con:
   ```env
   PORT=3001
   JWT_SECRET=tu_secreto_aleatorio
   GOOGLE_CLIENT_ID=tu_client_id_de_google
   ```
4. Inicia el servidor: `npm run dev`

## 2. Google Login
Para obtener tu `GOOGLE_CLIENT_ID`:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto.
3. Configura la "Pantalla de consentimiento de OAuth".
4. En "Credenciales", crea un "ID de cliente de OAuth" (Tipo: Aplicación web).
5. Agrega `http://localhost:5173` (o el puerto de tu Vite) a "Orígenes de JavaScript autorizados".
6. Copia el Client ID y ponlo en el `.env` del servidor y en el `.env` del frontend (como `VITE_GOOGLE_CLIENT_ID`).

## 3. Configuración en Lightsail (Nginx)
Para que el móvil pueda comunicarse con el servidor, debes configurar Nginx para redirigir las peticiones `/api` al puerto 3001.

Edita tu archivo de configuración de Nginx (ej. `/etc/nginx/sites-available/default`):
```nginx
server {
    ...
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Luego reinicia Nginx: `sudo systemctl restart nginx`

## 4. PM2 en el Servidor
En tu servidor Lightsail, instala PM2 para que el servidor Node siempre esté corriendo:
```bash
sudo npm install -g pm2
cd /var/www/appcalendar/server
pm2 start index.js --name app-calendar-backend
pm2 save
```
