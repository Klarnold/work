from django.shortcuts import render
from django.http import HttpResponse


def GalleryView(request):
    template_name = "gallery/gallery.html"
    return render(request, template_name)