from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        login_identifier = attrs.get("username")
        password = attrs.get("password")

        user = None

        user = authenticate(username=login_identifier, password=password)

        if user is None:
            try:
                user_obj = User.objects.get(email=login_identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            raise ValueError("No se pudo autenticar con username ni con email.")

        attrs["username"] = user.username
        
        return super().validate(attrs)
