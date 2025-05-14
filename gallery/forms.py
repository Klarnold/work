from django import forms

from . import models


class AddImageForm(forms.ModelForm):

    class Meta:
        model = models.Image
        fields = ['urls_csv']
