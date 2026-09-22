from django.db import models


class Guest(models.Model):
    """Invitado que confirma (o no) su asistencia a la boda.

    El campo `name` NO es único: dos personas distintas pueden llamarse igual.
    Cada respuesta es un registro independiente.
    """

    name = models.CharField("nombre", max_length=200)
    attendance = models.BooleanField("asistencia", default=True)

    class Meta:
        ordering = ["name", "id"]
        verbose_name = "invitado"
        verbose_name_plural = "invitados"

    def __str__(self):
        return self.name
