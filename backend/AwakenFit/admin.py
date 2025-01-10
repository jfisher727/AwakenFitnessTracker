from django.contrib import admin

from .models import Exercise, Movement, Set, Workout

# Register your models here.

admin.site.register(Movement)
admin.site.register(Workout)
admin.site.register(Exercise)
admin.site.register(Set)
