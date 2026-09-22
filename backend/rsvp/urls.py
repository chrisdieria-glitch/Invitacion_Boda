from django.urls import path

from .views import RSVPCreateView

app_name = "rsvp"

urlpatterns = [
    # POST /api/rsvp/
    path("rsvp/", RSVPCreateView.as_view(), name="rsvp-create"),
]
