from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

from .models import Contacto, Evento, FechaEvento, FotoEvento, FotoNoticia, Noticia, Tag
from .utils import enviar_whatsapp_contacto


class ContactoPrivacidadTests(APITestCase):
    """Fase 0 / DECISIONES.md #7: solo `create` es público en Contacto."""

    def setUp(self):
        self.contacto = Contacto.objects.create(
            nombre_contacto="Ana",
            apellido_contacto="Perez",
            email="ana@example.com",
            telefono="123456789",
        )
        self.detail_url = reverse("contacto-detail", kwargs={"pk": self.contacto.pk})
        self.list_url = reverse("contacto-list")

    @patch('noticias.views.enviar_whatsapp_contacto')
    def test_create_es_publico(self, mock_enviar_whatsapp_contacto):
        payload = {
            "nombre_contacto": "Luis",
            "apellido_contacto": "Gomez",
            "email": "luis@example.com",
            "telefono": "987654321",
        }
        response = self.client.post(self.list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_enviar_whatsapp_contacto.assert_called_once()

    def test_retrieve_anonimo_es_rechazado(self):
        response = self.client.get(self.detail_url)
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_list_anonimo_es_rechazado(self):
        response = self.client.get(self.list_url)
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_retrieve_admin_es_permitido(self):
        admin = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="pass12345"
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GaleriaViewTests(APITestCase):
    """Fase 0 / DECISIONES.md #11: endpoint agregado liviano de fotos."""

    def setUp(self):
        self.autor = User.objects.create_superuser(
            username="autor", email="autor@example.com", password="pass12345"
        )
        self.noticia = Noticia.objects.create(
            titulo="Noticia con fotos", contenido="...", autor=self.autor, slug="noticia-con-fotos"
        )
        self.evento = Evento.objects.create(
            nombre="Evento con fotos", descripcion="...", lugar="Santiago", slug="evento-con-fotos"
        )
        FotoNoticia.objects.create(noticia=self.noticia, titulo="Foto 1", credito="Foto: Juan")
        FotoEvento.objects.create(evento=self.evento, titulo="Foto 2", credito="Foto: Ana")

    def test_galeria_publica_sin_auth(self):
        response = self.client.get(reverse("galeria"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_galeria_respeta_limit(self):
        response = self.client.get(reverse("galeria"), {"limit": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_galeria_incluye_credito_y_tipo(self):
        response = self.client.get(reverse("galeria"))
        tipos = {item["tipo"] for item in response.data["results"]}
        self.assertEqual(tipos, {"noticia", "evento"})
        self.assertTrue(all(item["credito"] for item in response.data["results"]))


class BusquedaViewTests(APITestCase):
    """Fase 0 / DECISIONES.md #4: búsqueda básica por título/tag."""

    def setUp(self):
        self.autor = User.objects.create_superuser(
            username="autor2", email="autor2@example.com", password="pass12345"
        )
        self.tag = Tag.objects.create(nombre="techno")
        self.noticia = Noticia.objects.create(
            titulo="Adam Beyer en Chile", contenido="...", autor=self.autor, slug="adam-beyer-chile"
        )
        self.noticia.tags.add(self.tag)

    def test_busqueda_sin_query_devuelve_vacio(self):
        response = self.client.get(reverse("buscar"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    def test_busqueda_por_titulo(self):
        response = self.client.get(reverse("buscar"), {"q": "Beyer"})
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["tipo"], "noticia")

    def test_busqueda_por_tag(self):
        response = self.client.get(reverse("buscar"), {"q": "techno"})
        self.assertEqual(response.data["count"], 1)


@override_settings(
    EVOLUTION_API_URL='https://evolution.example/messages',
    EVOLUTION_API_TOKEN='test-token',
    ADMIN_NUMBER='56912345678',
    CONTACT_NOTIFICATION_TIMEOUT=2.5,
)
class ContactoNotificationTests(TestCase):
    @patch('noticias.utils.requests.post')
    def test_notificacion_usa_timeout_configurado(self, mock_post):
        mock_post.return_value.raise_for_status.return_value = None

        enviada = enviar_whatsapp_contacto('Ana', 'ana@example.com', 'Mensaje de prueba')

        self.assertTrue(enviada)
        self.assertEqual(mock_post.call_args.kwargs['timeout'], 2.5)
