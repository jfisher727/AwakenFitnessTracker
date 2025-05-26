import django_filters

from AwakenFit.models import Workout


class WorkoutFilter(django_filters.FilterSet):
    start_month = django_filters.NumberFilter(field_name="start_time", lookup_expr="month")
    start_year = django_filters.NumberFilter(field_name="start_time", lookup_expr="year")

    class Meta:
        model = Workout
        fields = {"id": ["exact"], "name": ["icontains"], "template": ["exact"]}
