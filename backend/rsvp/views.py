from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import GuestSerializer


class RSVPCreateView(APIView):
    """Único endpoint público: recibe la confirmación de asistencia.

    Solo permite POST. Cualquier otro método (GET, PUT, DELETE...) devuelve
    405 Method Not Allowed, de modo que la lista de invitados nunca se puede
    consultar desde fuera.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = GuestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Respuesta registrada correctamente."},
            status=status.HTTP_201_CREATED,
        )
