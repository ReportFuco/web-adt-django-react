from noticias.views import *
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings

router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'anuncios', AnuncioViewSet)
router.register(r'comentarios', ComentarioViewSet, basename='comentarios')
router.register(r'tags', TagViewSet)
router.register(r'entrevistas', EntrevistaViewSet)
router.register(r'contacto', ContactoViewSet)
router.register(r'franjasuperior', FranjaSuperiorViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
