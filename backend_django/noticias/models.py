from django.db import models

# Create your models here.
class Noticia(models.Model):
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='noticias/', blank=True, null=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    autor = models.CharField(max_length=100)

    def __str__(self):
        return self.titulo

class Evento(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_hora = models.DateTimeField()
    lugar = models.CharField(max_length=255)
    imagen = models.ImageField(upload_to='eventos/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class Anuncio(models.Model):
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='anuncios/', blank=True, null=True)
    enlace = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.titulo