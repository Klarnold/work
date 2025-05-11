from django.db import models
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError


def validate_url_list(value):
    validator = URLValidator()
    urls = [url.strip() for url in value.split(',') if url.strip()]
    for url in urls:
        try:
            validator(url)
        except ValidationError:
            raise ValidationError(f"Invalid URL: {url}")

class Images(models.Model):
    urls_csv = models.TextField(
        blank=True,
        validators=[validate_url_list],
        help_text="Разделяйте URL запятыми"
    )

    @property
    def url_list(self):
        return [url.strip() for url in self.urls_csv.split(',') if url.strip()]

