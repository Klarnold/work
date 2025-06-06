from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import SignUpForm, LoginForm

from . import forms

REDIRECT_URL = "gallery:index"

def index(request):
    if request.user.is_authenticated:
        return redirect(REDIRECT_URL)
    return redirect("auth:log_in")


def LogUpView(request):
    if request.user.is_authenticated:
        return redirect(REDIRECT_URL)
    form = forms.SignUpForm()
    return render(
        request,
        "auth_app/log_up.html",
        {
            "form": form
        })


def log_up_processing_view(request):
    if request.method == "POST":
        form = forms.SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["password"])
            user.save()
            login(request, user)
            return redirect(REDIRECT_URL)
        else:
            messages.error(request, "Пользователь с таким email уже существует или был введен простой пароль.")
            return redirect("auth:log_up")
    messages.error(request, "Что-то пошло не так.")
    return redirect("auth:log_up")


def LogInView(request):
    if request.user.is_authenticated:
        return redirect(REDIRECT_URL)
    form = forms.SignInForm()
    return render(
        request,
        "auth_app/log_in.html",
        {
            "form": form,
        })


def log_in_processing_view(request):
    if request.method == "POST":
        form = forms.SignInForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data["user"]
            login(request, user)
            return redirect(REDIRECT_URL)
        messages.error(request, "Неправильный email или пароль.")
        return redirect("auth:log_in")
    messages.error(request, "Что-то пошло не так.")
    return redirect("auth:log_in")


@login_required(login_url="auth:log_in")
def log_out(request):
    logout(request)
    return redirect("gallery:index")
