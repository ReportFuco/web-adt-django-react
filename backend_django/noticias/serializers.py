from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class FotoBaseSerializer(serializers.ModelSerializer):
    url_publica = serializers.SerializerMethodField()

    def get_url_publica(self, obj):
        if not getattr(obj, 'imagen', None):
            return None
        try:
            media_url = obj.imagen.url
        except Exception:
            return None

        base_url = getattr(settings, 'MEDIA_PUBLIC_BASE_URL', '') or ''
        request = self.context.get('request') if hasattr(self, 'context') else None

        if base_url:
            return urljoin(base_url.rstrip('/') + '/', media_url.lstrip('/'))
        if request:
            return request.build_absolute_uri(media_url)
        return media_url


class FotoNoticiaSerializer(FotoBaseSerializer):
    class Meta:
        model = FotoNoticia
        fields = ['id', 'imagen', 'url_publica', 'titulo', 'descripcion', 'orden', 'destacada', 'creada_en']
        read_only_fields = ['id', 'creada_en', 'url_publica']


class FotoEventoSerializer(FotoBaseSerializer):
    class Meta:
        model = FotoEvento
        fields = ['id', 'imagen', 'url_publica', 'titulo', 'descripcion', 'orden', 'destacada', 'creada_en']
        read_only_fields = ['id', 'creada_en', 'url_publica']


class FotoEntrevistaSerializer(FotoBaseSerializer):
    class Meta:
        model = FotoEntrevista
        fields = ['id', 'imagen', 'url_publica', 'titulo', 'descripcion', 'orden', 'destacada', 'creada_en']
        read_only_fields = ['id', 'creada_en', 'url_publica']


class NoticiaSerializer(serializers.ModelSerializer):
    autor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_superuser=True)
    )
    autor_username = serializers.CharField(source='autor.username', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    fotos = FotoNoticiaSerializer(many=True, read_only=True)
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
    fotos = FotoEventoSerializer(many=True, read_only=True)
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
    fotos = FotoEntrevistaSerializer(many=True, read_only=True)
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
