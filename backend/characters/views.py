from rest_framework.generics import CreateAPIView

from .models import Character
from .serializers import CharacterSerializer


class CharacterCreateView(CreateAPIView):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
