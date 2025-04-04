from django.contrib.auth.models import User
from django.db import models


class Tag(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

class Noticia(models.Model):
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='noticias/', blank=True, null=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True)
    destacado = models.BooleanField(default=False)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    fuente = models.CharField(max_length=255, blank=True, null=True)
    vistas = models.IntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comentarios_habilitados = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo
    
class Comentario(models.Model):
    noticia = models.ForeignKey("noticia", on_delete=models.CASCADE, related_name="comentarios")
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    contenido = models.TextField(max_length=255)
    fecha_publicado = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.contenido

class Evento(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_hora = models.DateTimeField()
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    lugar = models.CharField(max_length=255)
    imagen = models.ImageField(upload_to='eventos/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class Anuncio(models.Model):
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='anuncios/', blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    enlace = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.titulo
    
class Entrevista(models.Model):
    artista = models.CharField(max_length=255)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    fecha_publicacion = models.DateField(auto_now_add=True)
    contenido = models.TextField()
    imagen_portada = models.ImageField(upload_to='entrevistas/', blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    periodista = models.CharField(max_length=255)
    tags = models.ManyToManyField('Tag', blank=True)
    destacado = models.BooleanField(default=False)

    def __str__(self):
        return f"Entrevista con {self.artista} - {self.fecha_publicacion}"
    
