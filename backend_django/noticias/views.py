from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework import viewsets, permissions
from .serializers import *
from .models import *
from .utils import enviar_whatsapp_contacto
import threading

CACHE_TTL = 60 * 5  # 5 minutos

@method_decorator(cache_page(CACHE_TTL), name='list')
@method_decorator(cache_page(CACHE_TTL), name='retrieve')
class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save()
        cache.clear()

    def perform_update(self, serializer):
        serializer.save()
        cache.clear()

    def perform_destroy(self, instance):
        super().perform_destroy(instance)
        cache.clear()


@method_decorator(cache_page(CACHE_TTL), name='list')
@method_decorator(cache_page(CACHE_TTL), name='retrieve')
class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('-fecha_hora')
    serializer_class = EventoSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save()
        cache.clear()

    def perform_update(self, serializer):
        serializer.save()
        cache.clear()

    def perform_destroy(self, instance):
        super().perform_destroy(instance)
        cache.clear()


class EntrevistaViewSet(viewsets.ModelViewSet):
    queryset = Entrevista.objects.all().order_by('-fecha_publicacion')
    serializer_class = EntrevistaSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ComentarioViewSet(viewsets.ModelViewSet):
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['noticia']

    def get_queryset(self):
        noticia_id = self.request.query_params.get('noticia', None)
        if noticia_id:
            return Comentario.objects.filter(noticia_id=noticia_id)
        return Comentario.objects.all()

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

    def perform_update(self, serializer):
        comentario = self.get_object()
        if self.request.user != comentario.autor:
            raise permissions.PermissionDenied("No puedes editar un comentario que no es tuyo.")
        serializer.save()

    def perform_destroy(self, instance):

        if self.request.user != instance.autor:
            raise permissions.PermissionDenied("No puedes eliminar un comentario que no es tuyo.")
        instance.delete()

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class FranjaSuperiorViewSet(viewsets.ModelViewSet):
    queryset = FranjaSuperior.objects.all()
    serializer_class = FranjaSuperiorSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer

    def get_permissions(self):
        if self.action in [ 'retrieve', 'create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        # Guarda el contacto en la base de datos
        contacto = serializer.save()

        threading.Thread(
            target=enviar_whatsapp_contacto,
            args=(
                contacto.nombre_contacto,
                contacto.email,
                f"Teléfono: {contacto.telefono or 'No indicado'}\n"
                f"Apellido: {contacto.apellido_contacto or ''}"
            )
        ).start()