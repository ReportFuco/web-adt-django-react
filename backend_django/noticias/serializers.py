from .models import Noticia, Evento, Anuncio, Comentario, Tag, Entrevista
from django.contrib.auth.models import User
from rest_framework import serializers

class NoticiaSerializer(serializers.ModelSerializer):
    autor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_superuser=True)
    )
    autor_username = serializers.CharField(source='autor.username', read_only=True)

    class Meta:
        model = Noticia
        fields = '__all__'
        extra_kwargs = {
            'contenido': {'allow_blank': True}
        }

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'

class AnuncioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anuncio
        fields = '__all__'

class EntrevistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrevista
        fields = "__all__"

class ComentarioSerializer(serializers.ModelSerializer):
    autor_username = serializers.CharField(source='autor.username', read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'noticia', 'autor', 'autor_username', 'contenido', 'fecha_publicado']
        read_only_fields = ['id', 'autor', 'autor_username', 'fecha_publicado']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'