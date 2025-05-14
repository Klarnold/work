from django.db import models
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from rest_framework import serializers

from auth_app.models import CustomUser


def validate_url_list(value):
    validator = URLValidator()
    urls = [url.strip() for url in value.split(',') if url.strip()]
    for url in urls:
        try:
            validator(url)
        except ValidationError:
            raise ValidationError(f"Invalid URL: {url}")

class Image(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="image", default=None)
    urls_csv = models.CharField(max_length=500)

    def __str__(self):
        return f'Is related with {self.user.email}'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


# class Images(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="images", default=None)
#     urls_csv = models.TextField(
#         blank=True,
#         validators=[validate_url_list],
#         help_text="Разделяйте URL запятыми"
#     )
#
#     def __str__(self):
#         return f'Is related with {self.author}'
#
#     @property
#     def url_list(self):
#         return [url.strip() for url in self.urls_csv.split(',') if url.strip()]
