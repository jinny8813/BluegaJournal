from django.test import TestCase
from django.urls import reverse

class HealthCheckTestCase(TestCase):
    def test_health_check(self):
        response = self.client.get(reverse('health_check'))
        self.assertEqual(response.status_code, 200)
