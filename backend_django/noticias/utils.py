from django.conf import settings
import requests
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile


EVOLUTION_API_URL = getattr(settings, "EVOLUTION_API_URL")
EVOLUTION_API_TOKEN = getattr(settings, "EVOLUTION_API_TOKEN")
ADMIN_NUMBER = getattr(settings, "ADMIN_NUMBER")

def enviar_whatsapp_contacto(nombre, email, mensaje):
    """
    Envía un mensaje de WhatsApp usando Evolution API con los datos del contacto.
    """
    texto = f"📩 Nuevo contacto:\nNombre: {nombre}\nEmail: {email}\nMensaje: {mensaje}"
    headers = {
        "Content-Type": "application/json",
        "apikey": EVOLUTION_API_TOKEN
    }
    payload = {
        "number": ADMIN_NUMBER,
        "text": texto,
        "delay":1200
    }
    try:
        r = requests.post(EVOLUTION_API_URL, json=payload, headers=headers)
        r.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error enviando mensaje a Evolution API: {e}")
        return False


def optimizar_imagen(imagen_field, max_size=(1200, 1200), calidad=80, formato='WEBP'):
    if not imagen_field:
        print("Campo de imagen vacío")
        return None
        
    if not hasattr(imagen_field, 'file'):
        print("El campo no tiene atributo file")
        return None

    try:
        img = Image.open(imagen_field)
    except Exception as e:
        print(f"Error abriendo imagen para optimizar: {e}")
        return None

    try:
        img = img.convert('RGB')
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        temp = BytesIO()
        img.save(temp, format=formato, quality=calidad, optimize=True)
        temp.seek(0)

        nombre_original = imagen_field.name
        if '.' in nombre_original:
            nombre_original = nombre_original.rsplit('.', 1)[0]
        nuevo_nombre = f"{nombre_original}.{formato.lower()}"

        return ContentFile(temp.read()), nuevo_nombre
        
    except Exception as e:
        print(f"Error procesando imagen: {e}")
        return None