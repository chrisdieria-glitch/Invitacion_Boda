from rest_framework import serializers

from .models import Guest


class GuestSerializer(serializers.ModelSerializer):
    """Valida los datos enviados desde la página de la invitación."""

    # Se declaran explícitamente para que los dos campos sean siempre
    # obligatorios (el modelo tiene un default en `attendance`, y sin esto
    # DRF lo marcaría como opcional).
    name = serializers.CharField(
        required=True, allow_blank=True, trim_whitespace=True, max_length=200
    )
    attendance = serializers.BooleanField(required=True)

    class Meta:
        model = Guest
        fields = ["id", "name", "attendance"]

    def validate_name(self, value):
        # Elimina espacios innecesarios al principio, al final y repetidos.
        value = " ".join(value.split())
        if not value:
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value

    def validate(self, attrs):
        # `attendance` debe ser un booleano real: true o false (sin comillas).
        if "attendance" in self.initial_data and not isinstance(
            self.initial_data["attendance"], bool
        ):
            raise serializers.ValidationError(
                {"attendance": "Debe ser un booleano: true o false."}
            )
        return attrs
