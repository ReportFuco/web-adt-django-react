from django.contrib import admin
from .models import Producto, Categoria


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ["nombre", "categoria"]
    prepopulated_fields = {"slug": ("nombre",)}
    list_filter = ("categoria",)
    search_fields = ("nombre",)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ["nombre", "slug"]
    prepopulated_fields = {"slug": ("nombre",)}