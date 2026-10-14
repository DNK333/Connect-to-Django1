from rest_framework import status
from rest_framework.test import APITestCase

from .models import Character


class CharacterCreateTests(APITestCase):
    url = "/api/characters/"

    def setUp(self):
        self.valid_payload = {
            "name": "Arthas",
            "character_class": "Воин",
            "level": 5,
            "weapon": "Меч",
            "description": "Опытный боец",
        }

    def test_creates_character_and_returns_it(self):
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Arthas")
        self.assertEqual(response.data["character_class"], "Воин")
        self.assertEqual(Character.objects.count(), 1)

    def test_rejects_short_name(self):
        payload = {**self.valid_payload, "name": "Ab"}

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
        self.assertEqual(Character.objects.count(), 0)

    def test_rejects_level_outside_range(self):
        for level in (0, 101):
            with self.subTest(level=level):
                payload = {**self.valid_payload, "level": level}
                response = self.client.post(self.url, payload, format="json")
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Character.objects.count(), 0)

    def test_rejects_blank_description(self):
        payload = {**self.valid_payload, "description": "   "}

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("description", response.data)
        self.assertEqual(Character.objects.count(), 0)
