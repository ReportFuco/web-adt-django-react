from django.contrib import admin
from .models import Noticia, Evento, Anuncio, Comentario

admin.site.register(Comentario)
admin.site.register(Noticia)
admin.site.register(Evento)
admin.site.register(Anuncio)