import threading

from django.core.cache import cache
from django.db.models import F, Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import *
from .serializers import *
from .utils import enviar_whatsapp_contacto

CACHE_TTL = 60 * 5  # 5 minutos

@method_decorator(cache_page(CACHE_TTL), name='list')
class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.select_related('autor').prefetch_related('tags').all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Noticia.objects.filter(pk=instance.pk).update(vistas=F('vistas') + 1)
        instance.refresh_from_db(fields=['vistas'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.prefetch_related('tags').all().order_by('-fecha_hora')
    serializer_class = EventoSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Evento.objects.filter(pk=instance.pk).update(vistas=F('vistas') + 1)
        instance.refresh_from_db(fields=['vistas'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
class EntrevistaViewSet(viewsets.ModelViewSet):
    queryset = Entrevista.objects.prefetch_related('tags').all().order_by('-fecha_publicacion')
    serializer_class = EntrevistaSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Entrevista.objects.filter(pk=instance.pk).update(vistas=F('vistas') + 1)
        instance.refresh_from_db(fields=['vistas'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all().order_by('orden', '-id')
    serializer_class = AnuncioSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'track_click']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        qs = Anuncio.objects.all().order_by('orden', '-id')
        if self.action in ['list', 'retrieve']:
            now = timezone.now()
            qs = qs.filter(activo=True).filter(
                Q(fecha_inicio__isnull=True) | Q(fecha_inicio__lte=now),
                Q(fecha_fin__isnull=True) | Q(fecha_fin__gte=now)
            )
            ubicacion = self.request.query_params.get('ubicacion')
            if ubicacion:
                qs = qs.filter(ubicacion=ubicacion)
        return qs

    @action(detail=True, methods=['post'], url_path='track-click')
    def track_click(self, request, pk=None):
        anuncio = self.get_object()
        Anuncio.objects.filter(pk=anuncio.pk).update(clicks=F('clicks') + 1)
        anuncio.refresh_from_db(fields=['clicks'])
        return Response({'id': anuncio.id, 'clicks': anuncio.clicks})

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
    queryset = FranjaSuperior.objects.all().order_by('-id')
    serializer_class = FranjaSuperiorSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'latest', 'track_click']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['get'], url_path='latest')
    def latest(self, request):
        franja = self.get_queryset().first()
        if not franja:
            return Response({'detail': 'No hay franja superior disponible.'}, status=404)
        serializer = self.get_serializer(franja)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='track-click')
    def track_click(self, request, pk=None):
        franja = self.get_object()
        FranjaSuperior.objects.filter(pk=franja.pk).update(vistas=F('vistas') + 1)
        franja.refresh_from_db(fields=['vistas'])
        return Response({'id': franja.id, 'vistas': franja.vistas})


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