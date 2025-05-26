from django.contrib import admin

from .models import Exercise, Movement, Set, Workout

# Register your models here.


class SetInline(admin.TabularInline):
    model = Set
    extra = 2


class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 2


class MovementAdmin(admin.ModelAdmin):
    search_fields = ["name"]


class ExerciseAdmin(admin.ModelAdmin):
    inlines = [SetInline]
    autocomplete_fields = ["movement"]


class WorkoutAdmin(admin.ModelAdmin):
    inlines = [ExerciseInline]


admin.site.register(Movement, MovementAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Set)
