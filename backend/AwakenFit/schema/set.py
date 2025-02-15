from typing import Optional

from graphene import Node, List, ObjectType, InputObjectType, Int, String

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from AwakenFit.models import Set

from AwakenFit.domains import set as SetDomain


class SetNode(DjangoObjectType):
    class Meta:
        model = Set
        interfaces = (Node,)
        description = ""
        convert_choices_to_enum = False
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

    one_rep_max = Int()
    volume = Int()

    def resolve_one_rep_max(self, info) -> Optional[int]:
        if SetDomain.is_valid_id(self.id):
            selected_set = SetDomain.get_by_id(self.id)
            return SetDomain.calculate_one_rep_max(selected_set)
        return None

    def resolve_volume(self, info) -> Optional[int]:
        if SetDomain.is_valid_id(self.id):
            selected_set = SetDomain.get_by_id(self.id)
            return SetDomain.calculate_set_volume(selected_set)
        return None

    @classmethod
    def get_queryset(cls, queryset, info):
        return SetDomain.filter_queryset_by_user(queryset, info.context.user)


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


class Query(ObjectType):
    set = Node.Field(SetNode)
    sets = DjangoFilterConnectionField(SetNode)
