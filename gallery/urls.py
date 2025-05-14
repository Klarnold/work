from django.urls import path

from . import views
from .views import *

app_name="gallery"
urlpatterns = [
    path("", views.index, name="index"),
    path('api/image/', ImageListAPIView.as_view(), name='image-api'),
    path('api/image/create/', ImageCreateAPIView.as_view(), name='image-create'),
    path('api/add_image', views.add_image_view, name="add_image")
]