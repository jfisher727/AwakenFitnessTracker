from django.contrib.auth.mixins import LoginRequiredMixin
from graphene_django.views import GraphQLView

from rest_framework import authentication, permissions
from rest_framework.views import APIView

from allauth.headless.contrib.rest_framework.authentication import (
    XSessionTokenAuthentication,
)


class PrivateGraphQLView(GraphQLView, APIView):
    authentication_classes = [
        authentication.SessionAuthentication,
        XSessionTokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]
