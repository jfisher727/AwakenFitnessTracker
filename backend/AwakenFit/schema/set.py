from graphene import Node, List, InputObjectType, Int, String

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from ..models import Set


class SetNode(DjangoObjectType):
    class Meta:
        model = Set
        interfaces = (Node,)
        description = ""
        filter_fields = {
            "id": ["exact"],
        }
        fields = (
            "id",
            "exercise",
            "sequence_number",
            "completed_reps",
            "min_reps",
            "max_reps",
            "weight",
            "duration",
            "set_type",
            "parent_set",
        )


class SetCreateTemplateInput(InputObjectType):
    sequence_number = Int(required=True)
    min_reps = Int(required=False)
    max_reps = Int(required=False)
    duration = String(required=False)


class SetCreateCompletedInput(InputObjectType):
    sequence_number = Int(required=True)
    completed_reps = Int(required=False)
    weight = Int(required=False)
    duration = String(required=False)


class SetCreateTemplateParentInput(InputObjectType):
    set_type = String(required=True)
    associated_sets = List(SetCreateTemplateInput, required=True)


class SetCreateCompletedParentInput(InputObjectType):
    set_type = String(required=True)
    associated_sets = List(SetCreateCompletedInput, required=True)


class Query(object):
    set = Node.Field(SetNode)
    sets = DjangoFilterConnectionField(SetNode)
