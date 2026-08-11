from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, PerfilProfesionalViewSet,
    PlanViewSet, PlanClienteViewSet,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'perfiles-profesionales', PerfilProfesionalViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'planes-clientes', PlanClienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
