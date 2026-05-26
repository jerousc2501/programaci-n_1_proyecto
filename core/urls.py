from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, ProfesionalViewSet, ObjetivoViewSet,
    PlanNutricionalViewSet, ComidaViewSet, PlanEntrenamientoViewSet,
    EjercicioViewSet, MedicionViewSet, ProgresoEntrenamientoViewSet,
    ProductoViewSet, CarritoViewSet, PedidoViewSet,
    PedidoItemViewSet, PagoViewSet, SuscripcionViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'profesionales', ProfesionalViewSet)
router.register(r'objetivos', ObjetivoViewSet)
router.register(r'planes-nutricionales', PlanNutricionalViewSet)
router.register(r'comidas', ComidaViewSet)
router.register(r'planes-entrenamiento', PlanEntrenamientoViewSet)
router.register(r'ejercicios', EjercicioViewSet)
router.register(r'mediciones', MedicionViewSet)
router.register(r'progreso-entrenamiento', ProgresoEntrenamientoViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'carrito', CarritoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'pedidos-items', PedidoItemViewSet)
router.register(r'pagos', PagoViewSet)
router.register(r'suscripciones', SuscripcionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
