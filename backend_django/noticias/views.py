import itertools
import threading
from urllib.parse import urljoin

from django.conf import settings
from django.core.cache import cache
from django.db.models import F, Min, Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *
from .utils import enviar_whatsapp_contacto

CACHE_TTL = 60 * 5  # 5 minutos
GALERIA_LIMIT_DEFAULT = 24
GALERIA_LIMIT_MAX = 60

@method_decorator(cache_page(CACHE_TTL), name='list')
class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.select_related('autor').prefetch_related('tags', 'fotos').all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = Noticia.objects.select_related('autor').prefetch_related('tags', 'fotos').all().order_by('-fecha_publicacion')
        if self.action == 'list':
            tag = self.request.query_params.get('tag')
            if tag:
                qs = qs.filter(tags__nombre=tag)
            destacado = self.request.query_params.get('destacado')
            if destacado is not None:
                qs = qs.filter(destacado=destacado.lower() in ('1', 'true'))
        return qs.distinct()

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
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    lookup_field = "slug"

    def get_queryset(self):
        hoy = timezone.localdate()
        qs = (
            Evento.objects.prefetch_related('tags', 'fotos', 'fechas')
            .annotate(
                fecha_proxima=Min('fechas__fecha', filter=Q(fechas__fecha__gte=hoy)),
                fecha_principal=Min('fechas__fecha'),
            )
        )
        if self.action == 'list':
            tag = self.request.query_params.get('tag')
            if tag:
                qs = qs.filter(tags__nombre=tag)
            destacado = self.request.query_params.get('destacado')
            if destacado is not None:
                qs = qs.filter(destacado=destacado.lower() in ('1', 'true'))
            proximos = self.request.query_params.get('proximos')
            if proximos is not None and proximos.lower() in ('1', 'true'):
                # DECISIONES.md / AUDITORIA.md #5: "próximos" excluye eventos
                # pasados aunque `fecha_hora` tenga fallback histórico.
                qs = qs.filter(fecha_proxima__isnull=False)
        return qs.distinct().order_by(
            F('fecha_proxima').asc(nulls_last=True),
            F('fecha_principal').desc(nulls_last=True),
            'id',
        )

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
    queryset = Entrevista.objects.prefetch_related('tags', 'fotos').all().order_by('-fecha_publicacion')
    serializer_class = EntrevistaSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = Entrevista.objects.prefetch_related('tags', 'fotos').all().order_by('-fecha_publicacion')
        if self.action == 'list':
            tag = self.request.query_params.get('tag')
            if tag:
                qs = qs.filter(tags__nombre=tag)
            destacado = self.request.query_params.get('destacado')
            if destacado is not None:
                qs = qs.filter(destacado=destacado.lower() in ('1', 'true'))
        return qs.distinct()

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


class RedSocialViewSet(viewsets.ModelViewSet):
    queryset = RedSocial.objects.all()
    serializer_class = RedSocialSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        qs = RedSocial.objects.all()
        if self.action in ['list', 'retrieve']:
            qs = qs.filter(activo=True)
        return qs


class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer

    def get_permissions(self):
        if self.action == 'create':
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


def _foto_url_publica(imagen_field, request=None):
    if not imagen_field:
        return None
    try:
        media_url = imagen_field.url
    except Exception:
        return None

    base_url = getattr(settings, 'MEDIA_PUBLIC_BASE_URL', '') or ''
    if base_url:
        return urljoin(base_url.rstrip('/') + '/', media_url.lstrip('/'))
    if request:
        return request.build_absolute_uri(media_url)
    return media_url


class GaleriaView(APIView):
    """Fase 0 / DECISIONES.md #11: agregado liviano de fotos de noticias,
    eventos y entrevistas, ordenadas por fecha de carga. Alimenta la Galería
    del home y la página /cultura (DECISIONES.md #6), que reutiliza este
    mismo endpoint sin un modelo de contenido propio.

    - `?limit=N` (usado por el home): devuelve las N fotos más recientes sin
      paginar, `N` acotado a `GALERIA_LIMIT_MAX`.
    - Sin `limit` (usado por /cultura): pagina con `PageNumberPagination`,
      tamaño de página `GALERIA_LIMIT_DEFAULT`.
    """
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination

    def get(self, request):
        fotos = list(itertools.chain(
            FotoNoticia.objects.select_related('noticia').all(),
            FotoEvento.objects.select_related('evento').all(),
            FotoEntrevista.objects.select_related('entrevista').all(),
        ))
        fotos.sort(key=lambda foto: foto.creada_en, reverse=True)

        limit = request.query_params.get('limit')
        if limit is not None:
            try:
                limit = max(1, min(int(limit), GALERIA_LIMIT_MAX))
            except ValueError:
                limit = GALERIA_LIMIT_DEFAULT
            items = [self._serialize(foto, request) for foto in fotos[:limit]]
            return Response({'results': items, 'count': len(items), 'next': None, 'previous': None})

        paginator = self.pagination_class()
        paginator.page_size = GALERIA_LIMIT_DEFAULT
        page = paginator.paginate_queryset(fotos, request, view=self)
        items = [self._serialize(foto, request) for foto in page]
        return paginator.get_paginated_response(items)

    def _serialize(self, foto, request):
        if isinstance(foto, FotoNoticia):
            tipo, contenido = 'noticia', foto.noticia
        elif isinstance(foto, FotoEvento):
            tipo, contenido = 'evento', foto.evento
        else:
            tipo, contenido = 'entrevista', foto.entrevista

        titulo_contenido = (
            getattr(contenido, 'titulo', None)
            or getattr(contenido, 'nombre', None)
            or getattr(contenido, 'artista', None)
        )

        return {
            'id': foto.id,
            'tipo': tipo,
            'imagen': _foto_url_publica(foto.imagen, request),
            'titulo': foto.titulo,
            'descripcion': foto.descripcion,
            'credito': foto.credito,
            'destacada': foto.destacada,
            'creada_en': foto.creada_en,
            'contenido_id': contenido.id,
            'contenido_slug': contenido.slug,
            'contenido_titulo': titulo_contenido,
        }


class BusquedaView(APIView):
    """Fase 0 / DECISIONES.md #4: búsqueda básica por título/artista y tag,
    combinando Noticia, Evento y Entrevista. Paginada con PageNumberPagination.
    """
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination

    def get(self, request):
        query = (request.query_params.get('q') or '').strip()
        if not query:
            return Response({'results': [], 'count': 0, 'next': None, 'previous': None})

        noticias = Noticia.objects.filter(
            Q(titulo__icontains=query) | Q(tags__nombre__icontains=query)
        ).distinct()
        eventos = Evento.objects.filter(
            Q(nombre__icontains=query) | Q(tags__nombre__icontains=query)
        ).distinct()
        entrevistas = Entrevista.objects.filter(
            Q(artista__icontains=query) | Q(tags__nombre__icontains=query)
        ).distinct()

        resultados = list(itertools.chain(
            (self._serialize('noticia', n, request) for n in noticias),
            (self._serialize('evento', e, request) for e in eventos),
            (self._serialize('entrevista', e, request) for e in entrevistas),
        ))
        resultados.sort(key=lambda item: item['fecha'] or '', reverse=True)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(resultados, request, view=self)
        return paginator.get_paginated_response(page)

    def _serialize(self, tipo, obj, request):
        if tipo == 'noticia':
            titulo, fecha, imagen = obj.titulo, obj.fecha_publicacion, obj.imagen
        elif tipo == 'evento':
            titulo, fecha, imagen = obj.nombre, obj.fecha_hora, obj.imagen
        else:
            titulo, fecha, imagen = obj.artista, obj.fecha_publicacion, obj.imagen_portada

        return {
            'tipo': tipo,
            'id': obj.id,
            'slug': obj.slug,
            'titulo': titulo,
            'fecha': str(fecha) if fecha else None,
            'imagen': _foto_url_publica(imagen, request) if imagen else None,
        }
