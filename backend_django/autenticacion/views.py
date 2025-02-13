from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            username = request.data.get("username")
            try:
                user = User.objects.get(username=username)
                
                if user.is_superuser:
                    role = "admin"
                elif user.is_staff:
                    role = "staff"
                else:
                    role = "user"

                response.data.update({
                    "username": user.username,
                    "email": user.email,
                    "profile_picture": user.profile.profile_picture.url if hasattr(user, 'profile') and user.profile.profile_picture else None,
                    "role": role,  # Nuevo campo para identificar el tipo de usuario
                    "is_superuser": user.is_superuser,  # Booleano si es superusuario
                    "is_staff": user.is_staff, # Booleano si tiene permisos de staff
                    "last.login": user.last_login
                })
            except User.DoesNotExist:
                response.data.update({"error": "Usuario no encontrado"})

        return response
