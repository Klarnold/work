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

    def test_login(self):
        response = self.client.post('/accounts/login/', {'username': 'test@example.com', 'password': 'password'})
        self.assertEqual(response.status_code, 302)

    def test_protected_page(self):
        response = self.client.get('/protected/')
        self.assertEqual(response.status_code, 302)  # Redirect to login page