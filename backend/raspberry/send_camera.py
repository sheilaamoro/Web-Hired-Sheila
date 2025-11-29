"""
Código prácticamente idéntico al que daba Guillermo pero sin detección
de personas con YOLOv8 desde la webcam. En realidad es como una especie
de simulación, porque esto emite desde la webcam del portátil donde se 
está ejecutano el script, pero la idea es que la Raspberry tiene que 
hacer esto según se encienda.  
"""
import time
import cv2
import base64
import requests

url = "http://localhost:3000/video" # Dirección url del servidor, a donde le tiene que enviar los frames de vídeo

cap = cv2.VideoCapture("http://10.40.152.162:4747/video")  
session  = requests.Session()

while True:
    ret, frame = cap.read() # Leer un frame de la cámara
    if not ret: # Si no se ha podido leer el frame, salir del if 
        continue

    # Codificar a JPEG
    _, buffer = cv2.imencode('.jpg', frame)
    jpg_as_text = base64.b64encode(buffer).decode()

    # Enviar POST al servidor con el frame correspondiente  
    try:
        resp = session.post(url, json={"frame": f"data:image/jpeg;base64,{jpg_as_text}"}, timeout=3)
        if resp.status_code != 200:
            print("Servidor respondió:", resp.status_code, resp.text)
    except requests.RequestException as e:
        print("Error enviando frame:", e)
        time.sleep(1)

# capturar vídeo: hecho
# guardar vídeo, para almacenar en bbdd: por hacer (bbdd mediante vpn) conectarse a la bbdd desde vpn para mirar las tablas y preguntar cómo hacer consultas pa la página web


