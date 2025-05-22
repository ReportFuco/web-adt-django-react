from rest_framework.decorators import api_view, permission_classes
from .serializers import CategoriaSerializer, ProductoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Categoria, Producto
from django.conf import settings
import mercadopago


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

from django.shortcuts import get_object_or_404
from .models import Producto  # Asegúrate de importar tu modelo

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_preferencia_pago(request):
    try:
        items_carrito = request.data.get('carrito', [])
        
        if not items_carrito:
            return Response({"error": "El carrito está vacío"}, status=400)

        sdk = mercadopago.SDK(settings.MERCADO_PAGO['ACCESS_TOKEN'])
        preferencia = {
            "items": [],
            "payer": {
                "name": request.user.username,
                "email": request.user.email
    },
    "back_urls": {
        "success": "http://192.168.1.4:5173/pago/exitoso",
        "failure": "http://192.168.1.4:5173/pago/fallido",
        "pending": "http://192.168.1.4:5173/pago/pendiente"
    },
    # "auto_return": "approved"
}

        for item in items_carrito:
            producto_id = item.get("producto_id")
            cantidad = int(item.get("cantidad", 1))
            
            try:
                producto = Producto.objects.get(id=producto_id)
            except Producto.DoesNotExist:
                return Response(
                    {"error": f"Producto con ID {producto_id} no existe"},
                    status=404
                )

            if cantidad > producto.stock:
                return Response(
                    {"error": f"No hay suficiente stock para {producto.nombre}"},
                    status=400
                )

            preferencia["items"].append({
                "id": str(producto.id),
                "title": producto.nombre,
                "quantity": cantidad,
                "unit_price": float(producto.precio),
                "currency_id": "CLP",  # Cambia a "PEN" si estás en Perú
                "description": producto.descripcion[:250],  # Límite de caracteres
            })

        respuesta = sdk.preference().create(preferencia)
        print("Respuesta de MP:", respuesta)
        if not respuesta or "response" not in respuesta:
            return Response(
                {"error": "Error al conectar con Mercado Pago"},
                status=500
            )

        return Response({
            "id": respuesta["response"]['id'],
            "init_point": respuesta["response"]["init_point"],
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)