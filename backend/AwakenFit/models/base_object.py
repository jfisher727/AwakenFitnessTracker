from django.db import models


class BaseModel(models.Model):
    date_created = models.DateField(auto_now_add=True, null=True)
    last_modified = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True
