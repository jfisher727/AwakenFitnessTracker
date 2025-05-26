from graphene import ObjectType
from graphene import String


class MessageNode(ObjectType):
    message = String(required=False)
