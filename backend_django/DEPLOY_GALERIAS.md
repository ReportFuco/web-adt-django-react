# Deploy galerías de fotos + URLs públicas

## Cambios incluidos

- Soporte backend para múltiples fotos por:
  - noticia
  - evento
  - entrevista
- Admin Django con:
  - subida de fotos extra
  - vista previa
  - URL pública copiable
- API con campo `url_publica` en cada foto

## Archivos clave

- `noticias/models.py`
- `noticias/serializers.py`
- `noticias/admin.py`
- `noticias/views.py`
- `noticias/migrations/0010_fotonoticia_fotoevento_fotoentrevista.py`
- `backend_django/settings.py`

## Variable nueva recomendada

Agregar en `.env` de producción:

```env
MEDIA_PUBLIC_BASE_URL=https://adictosaltechno.com
```

Notas:
- Si los archivos media se sirven desde el mismo dominio principal, ese valor sirve bien.
- Si luego los sirves desde otro subdominio o CDN, cambiar aquí.

## Pasos de despliegue

### 1. Subir código

```bash
git pull
```

### 2. Activar entorno backend

```bash
cd backend_django
source env/bin/activate
```

### 3. Verificar `.env`

Asegurarse de tener:

```env
MEDIA_PUBLIC_BASE_URL=https://adictosaltechno.com
```

### 4. Ejecutar migraciones

```bash
python manage.py migrate noticias
```

### 5. Verificación rápida Django

```bash
python manage.py check
```

### 6. Reiniciar backend

Según cómo esté corriendo en servidor (gunicorn/systemd/supervisor/docker).

## Pruebas manuales después del deploy

### Admin

1. Abrir una noticia existente en admin
2. Ver sección de fotos extra
3. Subir una foto
4. Confirmar que aparece:
   - miniatura
   - campo con URL pública
5. Abrir esa URL en otra pestaña

### API

Probar un detalle de noticia/evento/entrevista y revisar que venga algo así:

```json
{
  "fotos": [
    {
      "id": 1,
      "imagen": "/media/noticias/galeria/archivo.webp",
      "url_publica": "https://adictosaltechno.com/media/noticias/galeria/archivo.webp",
      "titulo": "",
      "descripcion": "",
      "orden": 0,
      "destacada": false
    }
  ]
}
```

## Estado esperado

- La imagen principal actual sigue funcionando igual
- Las fotos extra quedan disponibles como galería
- Cada foto tiene link copiable para reutilizar en bajada, cuerpo o donde se necesite

## Pendiente opcional futuro

- Botón explícito de `Copiar URL` en admin
- Permitir cargar foto por URL externa
- Mostrar galería en frontend con carrusel
