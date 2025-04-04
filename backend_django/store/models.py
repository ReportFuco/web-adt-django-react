from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)

    class Meta:
        ordering = ["nombre"]
        indexes = [models.Index(fields=["nombre"])]
        verbose_name = "Categoria"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, blank=True)
    nombre = models.CharField(max_length=150)
    slug = models.SlugField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.PositiveIntegerField()
    stock = models.PositiveIntegerField()
    imagen = models.ImageField(upload_to='productos/', blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre"]
        indexes = [
            models.Index(fields=["id", "slug"]),
            models.Index(fields=["nombre"]),
            models.Index(fields=["creado"]),
        ]

    def __str__(self):
        return self.nombre