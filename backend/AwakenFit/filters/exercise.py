import django_filters

from graphql_relay import from_global_id

from AwakenFit.models import Exercise


class MovementIdFilter(django_filters.CharFilter):
    def filter(self, qs, value):
        if value:
            qs = qs.filter(movement_id=from_global_id(value).id)
        return qs


class ExerciseFilter(django_filters.FilterSet):
    movement_id = MovementIdFilter(field_name="movement_id")

    class Meta:
        model = Exercise
        fields = {"id": ["exact"]}
