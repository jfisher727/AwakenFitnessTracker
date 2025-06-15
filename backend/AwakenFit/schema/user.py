from graphene import ObjectType, Boolean


class Query(ObjectType):
    is_super_user = Boolean()

    def resolve_is_super_user(root, info):
        return info.context.user.is_superuser
