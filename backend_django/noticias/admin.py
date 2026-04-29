from urllib.parse import urljoin

from django import forms
from django.conf import settings
from django.contrib import admin
from django.db import models as db_models
from django.utils.html import format_html
from tinymce.widgets import TinyMCE

from .models import *


class NoticiaAdminForm(forms.ModelForm):
    contenido = forms.CharField(
        widget=TinyMCE(),
        help_text=(
            'Para Instagram, pega la URL del post en una línea propia o usa '
            '[instagram]https://www.instagram.com/p/.../[/instagram].'
        ),
        required=False,
    )

    class Meta:
        model = Noticia
        fields = '__all__'


class EventoAdminForm(forms.ModelForm):
    class Meta:
        model = Evento
        fields = '__all__'
        widgets = {
            'descripcion': TinyMCE(),
        }


class EntrevistaAdminForm(forms.ModelForm):
    class Meta:
        model = Entrevista
        fields = '__all__'
        widgets = {
            'contenido': TinyMCE(),
        }


class FotoAdminInlineMixin:
    extra = 1
    readonly_fields = ('preview_imagen', 'url_publica')

    def _build_public_url(self, obj):
        if not getattr(obj, 'imagen', None):
            return ''
        try:
            media_url = obj.imagen.url
        except Exception:
            return ''

        base_url = getattr(settings, 'MEDIA_PUBLIC_BASE_URL', '') or ''
        if base_url:
            return urljoin(base_url.rstrip('/') + '/', media_url.lstrip('/'))
        return media_url

    @admin.display(description='Vista previa')
    def preview_imagen(self, obj):
        if not obj or not getattr(obj, 'imagen', None):
            return '-'
        try:
            return format_html(
                '<a href="{}" target="_blank" rel="noopener noreferrer">'
                '<img src="{}" style="max-height: 80px; max-width: 140px; border-radius: 6px;" />'
                '</a>',
                obj.imagen.url,
                obj.imagen.url,
            )
        except Exception:
            return '-'

    @admin.display(description='URL pública')
    def url_publica(self, obj):
        url = self._build_public_url(obj)
        if not url:
            return '-'
        return format_html(
            '<input type="text" value="{}" readonly style="width: 100%; min-width: 260px;" onclick="this.select();" />',
            url,
        )


class FotoNoticiaInline(FotoAdminInlineMixin, admin.TabularInline):
    model = FotoNoticia
    fields = ('imagen', 'preview_imagen', 'url_publica', 'titulo', 'descripcion', 'orden', 'destacada')


class FotoEventoInline(FotoAdminInlineMixin, admin.TabularInline):
    model = FotoEvento
    fields = ('imagen', 'preview_imagen', 'url_publica', 'titulo', 'descripcion', 'orden', 'destacada')


class FechaEventoInline(admin.TabularInline):
    model = FechaEvento
    fields = ('fecha',)
    extra = 1


class FotoEntrevistaInline(FotoAdminInlineMixin, admin.TabularInline):
    model = FotoEntrevista
    fields = ('imagen', 'preview_imagen', 'url_publica', 'titulo', 'descripcion', 'orden', 'destacada')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["id", "nombre"]
    search_fields = ["nombre"]
    ordering = ["nombre"]


@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    form = NoticiaAdminForm
    inlines = [FotoNoticiaInline]
    list_display = ["id", "titulo", "autor", "destacado", "vistas", "mostrar_tags", "fecha_publicacion"]
    prepopulated_fields = {"slug": ("titulo",)}
    list_filter = ("autor", "destacado", "tags", "fecha_publicacion")
    search_fields = ["titulo", "contenido", "fuente", "autor__username", "tags__nombre"]
    filter_horizontal = ("tags",)
    readonly_fields = ("vistas", "likes", "fecha_publicacion")

    @admin.display(description="Tags")
    def mostrar_tags(self, obj):
        return ", ".join(obj.tags.values_list("nombre", flat=True)) or "-"


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    form = EventoAdminForm
    inlines = [FechaEventoInline, FotoEventoInline]
    list_display = ["id", "nombre", "lugar", "destacado", "vistas", "mostrar_tags", "fecha_principal"]
    prepopulated_fields = {"slug": ("nombre",)}
    list_filter = ("destacado", "tags", "fechas__fecha", "lugar")
    search_fields = ["nombre", "descripcion", "lugar", "organizacion", "tags__nombre"]
    filter_horizontal = ("tags",)
    readonly_fields = ("vistas",)

    @admin.display(description="Tags")
    def mostrar_tags(self, obj):
        return ", ".join(obj.tags.values_list("nombre", flat=True)) or "-"

    @admin.display(description="Fecha principal", ordering="fecha_principal")
    def fecha_principal(self, obj):
        return obj.fecha_hora or "-"

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(fecha_principal=db_models.Min("fechas__fecha"))


@admin.register(Entrevista)
class EntrevistaAdmin(admin.ModelAdmin):
    form = EntrevistaAdminForm
    inlines = [FotoEntrevistaInline]
    list_display = ["id", "artista", "periodista", "destacado", "vistas", "mostrar_tags", "fecha_publicacion"]
    prepopulated_fields = {"slug": ("artista",)}
    list_filter = ("destacado", "tags", "fecha_publicacion", "periodista")
    search_fields = ["artista", "contenido", "periodista", "instagram", "tags__nombre"]
    filter_horizontal = ("tags",)
    readonly_fields = ("vistas", "fecha_publicacion")

    @admin.display(description="Tags")
    def mostrar_tags(self, obj):
        return ", ".join(obj.tags.values_list("nombre", flat=True)) or "-"


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ["noticia", "autor", "contenido"]
    list_filter = ("autor",)


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ["id", "nombre_contacto", "email", "fecha"]
    list_filter = ("fecha",)


@admin.register(FranjaSuperior)
class FranjaSuperiorAdmin(admin.ModelAdmin):
    list_display = ["id", "contenido", "url", "vistas"]
    search_fields = ["contenido", "url"]
    ordering = ["-id"]
    readonly_fields = ("vistas",)


@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):
    list_display = ["id", "titulo", "ubicacion", "activo", "orden", "clicks", "fecha_inicio", "fecha_fin"]
    list_filter = ["activo", "ubicacion", "fecha_inicio", "fecha_fin"]
    search_fields = ["titulo", "contenido", "enlace"]
    ordering = ["ubicacion", "orden", "-id"]
    readonly_fields = ("clicks",)
