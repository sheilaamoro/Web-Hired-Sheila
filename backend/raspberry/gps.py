import requests
import time
import random

# URL de tu endpoint POST
URL = "http://localhost:3000/gps"  # ajusta según tu servidor

# Coordenadas iniciales (Campus de Gijón)
lat = 43.53244
lon = -5.66206

# Intervalo de envío en segundos
INTERVALO = 2

while True:
    # Simular un pequeño movimiento
    lat += (random.random() - 0.5) * 0.0002
    lon += (random.random() - 0.5) * 0.0002

    payload = {
        "latitud": lat,
        "longitud": lon
    }

    try:
        res = requests.post(URL, json=payload)
        print("Enviado:", payload, "Respuesta:", res.status_code, res.text)
    except Exception as e:
        print("Error al enviar:", e)

    time.sleep(INTERVALO)
