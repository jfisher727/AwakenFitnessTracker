from graphene import Node

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from ..models import Movement
from ..domains import MovementDomain


class MovementNode(DjangoObjectType):
    class Meta:
        model = Movement
        interfaces = (Node,)
        description = ""
        filter_fields = {
            "id": ["exact"],
            "name": ["exact", "icontains", "istartswith"],
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


class Query(object):
    movement = Node.Field(MovementNode)
    movements = DjangoFilterConnectionField(MovementNode)
