from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.http import HttpResponse


@login_required(login_url="/auth_app/log_in")
def index(request):
    template_name = "gallery/gallery.html"
    if not request.user.is_authenticated:
        return redirect("auth:log_up")
    return render(request, template_name)
