from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["is_superuser"] = user.is_superuser

        return token

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

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este correo ya está en uso.")]
    )
    password2 = serializers.CharField(write_only=True, label="Confirm password")
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Las contraseñas deben coincidir.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user