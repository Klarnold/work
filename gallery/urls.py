from django.urls import path

from . import views
from .views import *

app_name="gallery"
urlpatterns = [
    path("", views.index, name="index"),
    path('api/add_image', views.add_image_view, name="add_image")
]
