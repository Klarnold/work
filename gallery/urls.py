from django.urls import path

from . import views

urlpatterns = [
    path("", views.GalleryView, name="gallery"),
]