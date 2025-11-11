# Despliegue de HIRED-5G (Guía)

Fecha: 14-Oct-2025

## Resumen ejecutivo

Esta guía explica cómo desplegar el sistema que tienes en el repositorio en una máquina virtual. Cubre:
- Diagnóstico del repositorio.
- Requisitos de VM y software.
- Correcciones sugeridas (Dockerfile / docker-compose).
- Pasos detallados de provisión, despliegue y verificación.
- Opciones para proxy/SSL y pruebas con Raspberry Pi.


## 1) Qué encontré en el proyecto

- `backend/` contiene la API Node/Express + Socket.IO y un `docker-compose.yml` y `Dockerfile`.
- `docker-compose.yml` define 3 servicios: `frontend`, `backend`, `python-service`.
- `backend/index.js`, `backend/app/app.js` y `backend/app/routes/videos.js` muestran la lógica principal:
  - Servidor http + socket.io en el puerto 3000.
  - `POST /api/videos` acepta frames en base64 y los reemite como evento `frame`.
  - `app` sirve archivos estáticos desde la carpeta `frontend`.


## 2) Problemas y observaciones

- `backend/Dockerfile` contiene errores: mezcla pip y apt sin instalar Python, sintaxis inconsistente.
- `docker-compose.yml` en `backend/` apunta a `./frontend` y `./python-service` relativos a `backend/`. Probablemente el archivo debería estar en la raíz o las rutas ajustadas.
- Falta un `python-service` en el repo (o está en `raspberry/` con nombre distinto). Necesitamos confirmar o crear una carpeta `python-service` con su Dockerfile.


## 3) Recomendación de VM y requisitos

- OS: Ubuntu LTS (22.04 o 24.04)
- Recursos mínimos: 2 vCPU, 4GB RAM, 20GB disk (para pruebas)
- Software: Docker (Engine), docker-compose, git
- Redes: abrir puertos según diseño (ideal: 80/443 + proxy; servicios backend en red interna)


## 4) Plan de despliegue (resumido)

1. Corregir Dockerfiles y docker-compose en el repo (mover compose a la raíz o ajustar rutas).
2. Provisionar VM (crear, SSH, instalar Docker y Compose).
3. Clonar repo en VM.
4. Ejecutar `docker compose up -d --build`.
5. Verificar endpoints y logs.
6. (Opcional) Configurar proxy/SSL con Nginx o Traefik.


## 5) Correcciones sugeridas (con ejemplos)

### Backend Dockerfile (reemplazo sugerido)

```Dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

### Python service Dockerfile (nuevo, si se necesita OpenCV)

```Dockerfile
FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg build-essential libsm6 libxrender1 libxext6 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "send_camera.py"]
```

`requirements.txt` podría contener:
```
opencv-python
requests
```


## 6) Comandos para preparar una VM Ubuntu y desplegar

```bash
# en la VM Ubuntu
sudo apt update; sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release git
# instalar Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
# clonar y arrancar
git clone <tu-repo-url> hired
cd hired
docker compose up -d --build
# verificar
docker compose ps
docker compose logs -f backend
```


## 7) Verificación y pruebas

- `GET /api/status` => JSON {message: ...}
- `GET /` => devuelve `index.html` del frontend
- Hacer POST a `/api/videos` con JSON {frame: "<base64>"} y comprobar que clientes Socket.IO reciben evento `frame`.


## 8) Notas / mejoras futuras

- Para producción, usar Traefik o Nginx como proxy y obtener certificados con Let's Encrypt.
- Evaluar usar WebRTC para vídeo (más eficiente que base64 sobre POST).
- Añadir CI/CD y tests.


## 9) Archivos añadidos
- `deployment_hired5g.md` (esta guía)
- `deployment_hired5g.rtf` (versión Word-compatible)


---
Generado automáticamente el 14-Oct-2025.
