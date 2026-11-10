from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health_check(request):
    return JsonResponse({"status": "ok", "service": "api"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/auth/', include('users.urls')),
    path('api/health/', health_check),
]

urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
