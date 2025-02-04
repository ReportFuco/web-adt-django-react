from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Noticia, Evento, Anuncio
from .serializers import NoticiaSerializer, EventoSerializer, AnuncioSerializer

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('-fecha_hora')
    serializer_class = EventoSerializer

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer
