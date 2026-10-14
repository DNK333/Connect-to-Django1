from django.contrib import admin

from .models import Character


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ("name", "character_class", "level", "weapon", "created_at")
    list_filter = ("character_class", "weapon")
    search_fields = ("name", "description")
