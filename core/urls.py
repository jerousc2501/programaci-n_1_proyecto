from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, PerfilProfesionalViewSet,
    PlanViewSet, PlanClienteViewSet,
    EjercicioViewSet, RutinaPersonalizadaViewSet,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'perfiles-profesionales', PerfilProfesionalViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'planes-clientes', PlanClienteViewSet)
router.register(r'ejercicios', EjercicioViewSet)
router.register(r'rutinas-personalizadas', RutinaPersonalizadaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
