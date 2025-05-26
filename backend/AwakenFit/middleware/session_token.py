from allauth.headless.contrib.rest_framework.authentication import (
    XSessionTokenAuthentication,
)


class SessionTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        authentication = XSessionTokenAuthentication().authenticate(request=request)

        if authentication:
            user, _ = authentication
            request.user = user

        return self.get_response(request)
