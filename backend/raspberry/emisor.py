import cv2
import base64
import socketio
import time

# Crear cliente Socket.io
sio = socketio.Client()

# Conectar al backend Node.js
sio.connect("http://localhost:3000")  # cambia IP si está en otra máquina o red

# Fuente de vídeo (puede ser cámara IP, webcam o archivo)
cap = cv2.VideoCapture("http://192.168.1.105:4747/video")  # o 0 para la webcam local

if not cap.isOpened():
    print("No se pudo abrir la cámara")
    exit()

print("Transmisión iniciada...")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Frame no leído, reintentando...")
            time.sleep(0.1)
            continue

        # Codificar a JPEG
        _, buffer = cv2.imencode('.jpg', frame)

        # Convertir a Base64
        jpg_as_text = base64.b64encode(buffer).decode('utf-8')

        # Enviar el frame al backend
        sio.emit("frame", {"frame": f"data:image/jpeg;base64,{jpg_as_text}"})

        # Pequeño retardo para no saturar el servidor (~20 fps)
        time.sleep(0.05)

except KeyboardInterrupt:
    print("\nTransmisión detenida por el usuario.")

finally:
    cap.release()
    sio.disconnect()
    print("Conexión cerrada.")
