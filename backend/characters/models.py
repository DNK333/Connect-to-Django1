from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Character(models.Model):
    class CharacterClass(models.TextChoices):
        WARRIOR = "Воин", "Воин"
        MAGE = "Маг", "Маг"
        ARCHER = "Лучник", "Лучник"
        ROGUE = "Разбойник", "Разбойник"

    class Weapon(models.TextChoices):
        SWORD = "Меч", "Меч"
        STAFF = "Посох", "Посох"
        BOW = "Лук", "Лук"
        DAGGERS = "Кинжалы", "Кинжалы"

    name = models.CharField(max_length=50)
    character_class = models.CharField(max_length=20, choices=CharacterClass.choices)
    level = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    weapon = models.CharField(max_length=20, choices=Weapon.choices)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
