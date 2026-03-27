from django import forms
from django.contrib import admin
from tinymce.widgets import TinyMCE

from .models import *


class NoticiaAdminForm(forms.ModelForm):
    class Meta:
        model = Noticia
        fields = '__all__'
        widgets = {
            'contenido': TinyMCE(),
        }


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


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["id", "nombre"]
    search_fields = ["nombre"]
    ordering = ["nombre"]


@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    form = NoticiaAdminForm
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
    list_display = ["id", "nombre", "lugar", "destacado", "vistas", "mostrar_tags", "fecha_hora"]
    prepopulated_fields = {"slug": ("nombre",)}
    list_filter = ("destacado", "tags", "fecha_hora", "lugar")
    search_fields = ["nombre", "descripcion", "lugar", "organizacion", "tags__nombre"]
    filter_horizontal = ("tags",)
    readonly_fields = ("vistas",)

    @admin.display(description="Tags")
    def mostrar_tags(self, obj):
        return ", ".join(obj.tags.values_list("nombre", flat=True)) or "-"


@admin.register(Entrevista)
class EntrevistaAdmin(admin.ModelAdmin):
    form = EntrevistaAdminForm
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


admin.site.register(Anuncio)

