from django.contrib import admin

from .models import CustomUser


# class ChoiceInline(admin.StackedInline):
#     model = CustomUser
#     extra = 3
#
# class CustomUserAdmin(admin.ModelAdmin):
#     list_display = ["email", "password"]
#     fieldsets = [
#         (),
#         (),
#     ]

admin.site.register(CustomUser)