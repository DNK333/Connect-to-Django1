from rest_framework import serializers

from .models import Character


class CharacterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(min_length=3, max_length=50, trim_whitespace=True)
    description = serializers.CharField(
        trim_whitespace=True,
        allow_blank=False,
    )

    class Meta:
        model = Character
        fields = [
            "id",
            "name",
            "character_class",
            "level",
            "weapon",
            "description",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_level(self, value):
        if not 1 <= value <= 100:
            raise serializers.ValidationError("Уровень должен быть от 1 до 100.")
        return value
