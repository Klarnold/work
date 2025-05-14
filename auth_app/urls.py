from django.urls import path

from . import views


app_name="auth"
urlpatterns = [
    path('', views.index, name='index'),
    path("log_in", views.LogInView, name="log_in"),
    path("log_up", views.LogUpView, name="log_up"),
    path("log_out", views.log_out, name="log_out"),
    path("log_in/processing", views.log_in_processing_view, name="log_in_processing"),
    path("log_up/processing", views.log_up_processing_view, name="log_up_processing"),
]
