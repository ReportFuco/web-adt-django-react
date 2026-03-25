from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class NoticiaSerializer(serializers.ModelSerializer):
    autor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_superuser=True)
    )
    autor_username = serializers.CharField(source='autor.username', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, required=False, source='tags'
    )

    class Meta:
        model = Noticia
        fields = '__all__'
        extra_kwargs = {
            'contenido': {'allow_blank': True}
        }


class EventoSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, required=False, source='tags'
    )

    class Meta:
        model = Evento
        fields = '__all__'


class AnuncioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anuncio
        fields = '__all__'


class EntrevistaSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, required=False, source='tags'
    )

    class Meta:
        model = Entrevista
        fields = '__all__'


class ComentarioSerializer(serializers.ModelSerializer):
    autor_username = serializers.CharField(source='autor.username', read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'noticia', 'autor', 'autor_username', 'contenido', 'fecha_publicado']
        read_only_fields = ['id', 'autor', 'autor_username', 'fecha_publicado']


class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = '__all__'


class FranjaSuperiorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FranjaSuperior
        fields = '__all__'
