from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.contrib import messages
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Image, ImageSerializer

from . import forms


@login_required(login_url="/auth_app/log_in")
def index(request):
    template_name = "gallery/gallery.html"
    if not request.user.is_authenticated:
        return redirect("auth:log_up")
    images = Image.objects.all()  # Получаем все изображения из модели
    return render(request, template_name, {'images': images})


class ImageListAPIView(generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer


class ImageCreateAPIView(APIView):
    def post(self, request):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required(login_url="/auth_app/log_in")
def add_image_view(request):
    if request.method == "POST":
        form = forms.AddImageForm(request.POST)
        if form.is_valid():
            # Создаем объект, но не сохраняем сразу
            image = form.save(commit=False)
            # Устанавливаем пользователя из запроса
            image.user = request.user
            image.save()
            return redirect('gallery:index')  # Укажите правильный URL-name
        messages.error(request, "Ошибка в форме. Проверьте URL.")
    else:
        messages.error(request, "Неверный метод запроса.")
    return redirect('gallery:index')  # Редирект при ошибках

