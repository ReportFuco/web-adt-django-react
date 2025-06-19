from django.contrib import admin
from tinymce.widgets import TinyMCE
from django import forms
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

@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    form = NoticiaAdminForm
    list_display = ["titulo", "autor"]
    prepopulated_fields = {"slug": ("titulo",)}
    list_filter = ("autor",)

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    form = EventoAdminForm
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

