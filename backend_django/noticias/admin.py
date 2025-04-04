from django.contrib import admin
from .models import *


@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    list_display = ["titulo", "autor"]
    prepopulated_fields = {"slug": ("titulo",)}
    list_filter = ("autor",)

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ["nombre", "lugar"]
    prepopulated_fields = {"slug": ("nombre",)}

@admin.register(Entrevista)
class EntrevistaAdmin(admin.ModelAdmin):
    list_display = ["artista", "periodista", "instagram"]
    prepopulated_fields = {"slug": ("artista",)}

@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ["noticia", "autor", "contenido"]
    list_filter = ("autor",)

admin.site.register(Anuncio)