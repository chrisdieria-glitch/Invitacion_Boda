from django.contrib import admin

from .models import Guest


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    """Panel privado con la lista de invitados y su respuesta."""

    list_display = ("name", "attendance_display")
    list_display_links = ("name",)
    search_fields = ("name",)
    list_filter = ("attendance",)
    ordering = ("name", "id")
    readonly_fields = ("id",)

    @admin.display(description="Asistencia", ordering="attendance")
    def attendance_display(self, obj):
        return "Sí" if obj.attendance else "No"

    attendance_display.short_description = "Asistencia"
