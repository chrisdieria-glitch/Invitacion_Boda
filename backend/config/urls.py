"""URLs raíz del proyecto.

/admin/  -> panel privado de administración (autenticación estándar de Django)
/api/    -> API pública (solo permite enviar RSVP)
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("rsvp.urls")),
]
