from graphene_django.views import GraphQLView

from rest_framework import authentication, permissions
from rest_framework.views import APIView

from allauth.headless.contrib.rest_framework.authentication import (
    XSessionTokenAuthentication,
)


class PrivateGraphQLView(APIView, GraphQLView):
    authentication_classes = [
        XSessionTokenAuthentication,
        authentication.SessionAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]
