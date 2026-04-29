from django.db import models
from .utils import optimizar_imagen

class ImagenOptimizadaMixin(models.Model):
    class Meta:
        abstract = True

    def optimizar_y_guardar_imagen(self, campo_imagen):
        imagen_field = getattr(self, campo_imagen)
        if not imagen_field:
            return

        if getattr(imagen_field, "_committed", True):
            return

        print(f"Optimizing image field '{campo_imagen}' for {self}")
        contenido_optimizado = optimizar_imagen(imagen_field)
        if contenido_optimizado:
            content_file, nuevo_nombre = contenido_optimizado
            print(f"Saving optimized image {nuevo_nombre} for {self}")
            getattr(self, campo_imagen).save(nuevo_nombre, content_file, save=False)
        else:
            print(f"No content returned from optimizar_imagen for field '{campo_imagen}'")


    def save(self, *args, **kwargs):
        # Para cada campo de imagen que tenga el modelo, optimizamos antes de guardar
        campos_imagen = [f.name for f in self._meta.get_fields() if isinstance(f, models.ImageField)]
        for campo in campos_imagen:
            self.optimizar_y_guardar_imagen(campo)
        super().save(*args, **kwargs)
