from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from noticias.views import NoticiaViewSet, EventoViewSet, AnuncioViewSet

router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'anuncios', AnuncioViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

# ✅ Agregar servida de archivos de media en modo desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
