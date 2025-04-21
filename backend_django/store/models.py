from django.contrib.auth.models import User
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
    slug = models.SlugField(max_length=200, unique=True)
    descripcion = models.TextField(blank=True)
    precio = models.PositiveIntegerField()
    stock = models.PositiveIntegerField()
    imagen = models.ImageField(upload_to='productos/', blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)
    destacado = models.BooleanField(default=False)

    class Meta:
        ordering = ["nombre"]
        indexes = [
            models.Index(fields=["id", "slug"]),
            models.Index(fields=["nombre"]),
            models.Index(fields=["creado"]),
        ]

    def __str__(self):
        return self.nombre
    
class Pedido(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total = models.PositiveIntegerField()
    status = models.CharField(max_length=20, default='pending')
    payment_id = models.CharField(max_length=100, blank=True)
    shipping_address = models.TextField(blank=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

class ItemPedido(models.Model):
    order = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    product = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order #{self.order.id}"