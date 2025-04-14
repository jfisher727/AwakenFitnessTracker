from graphene import Node, ObjectType, InputObjectType, List, Int, String, ID

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from AwakenFit.models import Exercise

from AwakenFit.domains import exercise as ExerciseDomain
from AwakenFit.domains import set as SetDomain

from .set import (
    SetNode,
    SetCreateTemplateInput,
    SetCreateCompletedInput,
    SetCreateCompletedParentInput,
    SetCreateTemplateParentInput,
)


class ExerciseNode(DjangoObjectType):
    class Meta:
        model = Exercise
        interfaces = (Node,)
        description = ""
        filter_fields = {
            "id": ["exact"],
        }
        fields = (
            "id",
            "intensity",
            "notes",
            "movement",
            "workout",
        )

    sets = List(SetNode)

    @classmethod
    def get_queryset(cls, queryset, info):
        return ExerciseDomain.filter_queryset_by_user(queryset, info.context.user.id)

    def resolve_sets(self, info, **kwargs):
        return SetDomain.get_by_exercise_id(self.id)


class ExerciseCreateTemplateInput(InputObjectType):
    movement_id = ID(required=True)
    intensity = Int(required=False)
    notes = String(required=False)
    standard_sets = List(SetCreateTemplateInput, required=False)
    non_standard_sets = List(SetCreateTemplateParentInput, required=False)


class ExerciseCreateCompletedInput(InputObjectType):
    movement_id = ID(required=True)
    intensity = Int(required=False)
    notes = String(required=False)
    standard_sets = List(SetCreateCompletedInput, required=False)
    non_standard_sets = List(SetCreateCompletedParentInput, required=False)


class Query(ObjectType):
    exercise = Node.Field(ExerciseNode)
    exercises = DjangoFilterConnectionField(ExerciseNode)
