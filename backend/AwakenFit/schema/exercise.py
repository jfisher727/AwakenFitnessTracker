from graphene import Node, InputObjectType, List, Int, String, ID

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from ..models import Exercise

from .set import (
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


class Query(object):
    exercise = Node.Field(ExerciseNode)
    exercises = DjangoFilterConnectionField(ExerciseNode)
