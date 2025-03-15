from rest_framework import viewsets, permissions
from .serializers import *
from .models import *

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('-fecha_hora')
    serializer_class = EventoSerializer

class EntrevistaViewSet(viewsets.ModelViewSet):
    queryset = Entrevista.objects.all().order_by('-fecha_publicacion')
    serializer_class = EntrevistaSerializer

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer

class ComentarioViewSet(viewsets.ModelViewSet):
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        noticia_id = self.request.query_params.get('noticia_id', None)
        if noticia_id:
            return Comentario.objects.filter(noticia_id=noticia_id, aprobado=True)
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
