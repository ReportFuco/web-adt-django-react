# Proyecto: Noticias Música Techno

Este es un proyecto de una plataforma de noticias sobre música electrónica desarrollado con **Django (backend)** y **React con Vite (frontend)**, utilizando **Tailwind CSS** para los estilos.

## 📌 Tecnologías Utilizadas

### **Backend (Django)**
- Django 5.1.5
- Django REST Framework
- Django CORS Headers
- Django Filter
- Simple JWT para autenticación

### **Frontend (React + Vite)**
- React 18+
- Vite
- Tailwind CSS 4
- Fetch API para obtener datos del backend

---

## 📂 Estructura del Proyecto

```
web-electro/
│── backend_django/
│   │── backend_django/  # Configuración general de Django
│   │── noticias/         # Aplicación principal de noticias
│   │── media/            # Carpeta donde se almacenan las imágenes
│   │── db.sqlite3        # Base de datos SQLite (puede cambiarse a PostgreSQL o MySQL)
│   │── manage.py         # Comando de administración de Django
│
│── frontend/
│   │── src/
│   │   │── components/   # Componentes de React
│   │   │── services/     # API calls (fetch data)
│   │── index.html
│   │── vite.config.js
│
│── README.md             # Documentación del proyecto
│── requirements.txt       # Dependencias del backend
```

---

## 🚀 Instalación y Ejecución

### 🔹 **1️⃣ Backend (Django)**
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/web-electro.git
   cd web-electro/backend_django
   ```

2. Crear un entorno virtual e instalar dependencias:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows usar: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configurar la base de datos y aplicar migraciones:
   ```bash
   python manage.py migrate
   ```

4. Crear un superusuario para acceder al panel de administración:
   ```bash
   python manage.py createsuperuser
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

El backend estará corriendo en: **http://127.0.0.1:8000/**


### 🔹 **2️⃣ Frontend (React + Vite)**
1. Ir a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias de Node.js:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en: **http://localhost:5173/**

---

## 📡 Configuración Importante

### **Django - Manejo de Archivos Media**
En `backend_django/settings.py`, asegúrate de tener:
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

Y en `backend_django/urls.py`, agregar:
```python
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### **CORS (Cross-Origin Resource Sharing)**
Para permitir que el frontend pueda hacer peticiones al backend:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Dirección del frontend en desarrollo
]
```

---

## ✨ Mejoras Futuras
- [ ] Implementar autenticación de usuarios con JWT
- [ ] Agregar soporte para comentarios en las noticias
- [ ] Implementar un sistema de categorías y etiquetas
- [ ] Mejorar la interfaz de usuario con animaciones en Tailwind CSS

---

## 🔗 Contacto
Si tienes dudas o quieres contribuir al proyecto, contáctame en **tu_email@example.com** 🚀



