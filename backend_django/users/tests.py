from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase


@override_settings(
    CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'security-tests',
        }
    },
)
class AuthenticationSecurityTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username='security-user',
            email='security@example.com',
            password='ContraseñaSegura!2026',
        )

    def test_login_is_rate_limited(self):
        url = reverse('token_obtain_pair')
        credentials = {'username': self.user.username, 'password': 'incorrecta'}

        for _ in range(5):
            self.assertNotEqual(self.client.post(url, credentials).status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(self.client.post(url, credentials).status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_registration_rejects_a_weak_password(self):
        response = self.client.post(
            reverse('user_registration'),
            {
                'username': 'new-user',
                'email': 'new@example.com',
                'password': '12345678',
                'password2': '12345678',
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_registration_accepts_a_valid_password(self):
        response = self.client.post(
            reverse('user_registration'),
            {
                'username': 'new-user',
                'email': 'new@example.com',
                'password': 'ContraseñaSegura!2026',
                'password2': 'ContraseñaSegura!2026',
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_reset_rejects_a_weak_password(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = PasswordResetTokenGenerator().make_token(self.user)
        url = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})

        response = self.client.post(url, {'password': '12345678'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
