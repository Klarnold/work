from django.test import TestCase, Client
from django.urls import reverse

from .models import CustomUser


class AuthTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(email='test@example.com', password='password')

    def test_open_auth_index_page(self):
        response = self.client.get(reverse("auth:index"))
        self.assertEqual(response.status_code, 302)