from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from .mixins import ImagenOptimizadaMixin


class Tag(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

class Noticia(ImagenOptimizadaMixin, models.Model):
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

class Evento(ImagenOptimizadaMixin, models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    destacado = models.BooleanField(default=False)
    website = models.CharField(max_length=255, blank=True, null=True)
    lugar = models.CharField(max_length=255)
    imagen = models.ImageField(upload_to='eventos/', blank=True, null=True)
    direccion = models.CharField(max_length=100, null=True)
    organizacion = models.CharField(max_length=50, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    vistas = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nombre

    @property
    def fecha_hora(self):
        hoy = timezone.localdate()
        proxima_fecha = self.fechas.filter(fecha__gte=hoy).order_by('fecha', 'id').first()
        if proxima_fecha:
            return proxima_fecha.fecha
        ultima_fecha = self.fechas.order_by('-fecha', '-id').first()
        return ultima_fecha.fecha if ultima_fecha else None


class FechaEvento(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='fechas')
    fecha = models.DateField()

    class Meta:
        ordering = ['fecha', 'id']
        verbose_name = 'Fecha de evento'
        verbose_name_plural = 'Fechas de eventos'

    def __str__(self):
        return f"{self.evento.nombre} - {self.fecha}"

class Anuncio(ImagenOptimizadaMixin, models.Model):
    UBICACION_CHOICES = [
        ('home_between_news_events', 'Home entre Noticias y Eventos'),
        ('home_between_events_interviews', 'Home entre Eventos y Entrevistas'),
        ('home_after_interviews', 'Home después de Entrevistas'),
    ]

    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    imagen = models.ImageField(upload_to='anuncios/', blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    enlace = models.URLField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    ubicacion = models.CharField(max_length=64, choices=UBICACION_CHOICES, default='home_between_news_events')
    orden = models.PositiveIntegerField(default=0)
    cta_text = models.CharField(max_length=80, blank=True, null=True)
    fecha_inicio = models.DateTimeField(blank=True, null=True)
    fecha_fin = models.DateTimeField(blank=True, null=True)
    clicks = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.titulo
    
class Entrevista(ImagenOptimizadaMixin, models.Model):
    artista = models.CharField(max_length=255)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    fecha_publicacion = models.DateField(auto_now_add=True)
    contenido = models.TextField()
    imagen_portada = models.ImageField(upload_to='entrevistas/', blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    periodista = models.CharField(max_length=255)
    tags = models.ManyToManyField('Tag', blank=True)
    destacado = models.BooleanField(default=False)
    vistas = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Entrevista con {self.artista} - {self.fecha_publicacion}"
    
class FotoNoticia(ImagenOptimizadaMixin, models.Model):
    noticia = models.ForeignKey(Noticia, on_delete=models.CASCADE, related_name='fotos')
    imagen = models.ImageField(upload_to='noticias/galeria/')
    titulo = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    orden = models.PositiveIntegerField(default=0)
    destacada = models.BooleanField(default=False)
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', 'id']
        verbose_name = 'Foto de noticia'
        verbose_name_plural = 'Fotos de noticias'

    def __str__(self):
        return self.titulo or f"Foto noticia #{self.pk}"


class FotoEvento(ImagenOptimizadaMixin, models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='fotos')
    imagen = models.ImageField(upload_to='eventos/galeria/')
    titulo = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    orden = models.PositiveIntegerField(default=0)
    destacada = models.BooleanField(default=False)
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', 'id']
        verbose_name = 'Foto de evento'
        verbose_name_plural = 'Fotos de eventos'

    def __str__(self):
        return self.titulo or f"Foto evento #{self.pk}"


class FotoEntrevista(ImagenOptimizadaMixin, models.Model):
    entrevista = models.ForeignKey(Entrevista, on_delete=models.CASCADE, related_name='fotos')
    imagen = models.ImageField(upload_to='entrevistas/galeria/')
    titulo = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    orden = models.PositiveIntegerField(default=0)
    destacada = models.BooleanField(default=False)
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', 'id']
        verbose_name = 'Foto de entrevista'
        verbose_name_plural = 'Fotos de entrevistas'

    def __str__(self):
        return self.titulo or f"Foto entrevista #{self.pk}"


class FranjaSuperior(models.Model):
    contenido = models.CharField(max_length=500)
    url = models.URLField(blank=True, null=True)
    vistas = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Haz click aca para modificar la Franja"

class Contacto(models.Model):
    nombre_contacto = models.CharField(max_length=50, null=False)
    apellido_contacto = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, null=False)
    telefono = models.CharField(max_length=11, null=True, blank=True)
    fecha = models.DateField(auto_now_add=True)
