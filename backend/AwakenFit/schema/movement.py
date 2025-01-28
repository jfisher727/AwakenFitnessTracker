from graphene import Node, ObjectType

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from ..models import Movement
from ..domains import MovementDomain


class MovementNode(DjangoObjectType):
    class Meta:
        model = Movement
        interfaces = (Node,)
        description = ""
        convert_choices_to_enum = False
        filter_fields = {
            "id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
            "primary_muscle_group": ["exact"],
            "equipment_type": ["exact"],
            "movement_type": ["exact"],
        }
        fields = (
            "id",
            "name",
            "description",
            "primary_muscle_group",
            "secondary_muscle_group",
            "equipment_type",
            "movement_type",
        )


class Query(ObjectType):
    movement = Node.Field(MovementNode)
    movements = DjangoFilterConnectionField(MovementNode)
