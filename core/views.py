from rest_framework import viewsets
from .models import (
    Usuario, Profesional, Objetivo, PlanNutricional, Comida,
    PlanEntrenamiento, Ejercicio, Medicion, ProgresoEntrenamiento,
    Producto, Carrito, Pedido, PedidoItem, Pago, Suscripcion
)
from .serializers import (
    UsuarioSerializer, ProfesionalSerializer, ObjetivoSerializer,
    PlanNutricionalSerializer, ComidaSerializer, PlanEntrenamientoSerializer,
    EjercicioSerializer, MedicionSerializer, ProgresoEntrenamientoSerializer,
    ProductoSerializer, CarritoSerializer, PedidoSerializer,
    PedidoItemSerializer, PagoSerializer, SuscripcionSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class ProfesionalViewSet(viewsets.ModelViewSet):
    queryset = Profesional.objects.all()
    serializer_class = ProfesionalSerializer


class ObjetivoViewSet(viewsets.ModelViewSet):
    queryset = Objetivo.objects.all()
    serializer_class = ObjetivoSerializer


class PlanNutricionalViewSet(viewsets.ModelViewSet):
    queryset = PlanNutricional.objects.all()
    serializer_class = PlanNutricionalSerializer


class ComidaViewSet(viewsets.ModelViewSet):
    queryset = Comida.objects.all()
    serializer_class = ComidaSerializer


class PlanEntrenamientoViewSet(viewsets.ModelViewSet):
    queryset = PlanEntrenamiento.objects.all()
    serializer_class = PlanEntrenamientoSerializer


class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer


class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer


class ProgresoEntrenamientoViewSet(viewsets.ModelViewSet):
    queryset = ProgresoEntrenamiento.objects.all()
    serializer_class = ProgresoEntrenamientoSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer


class PedidoItemViewSet(viewsets.ModelViewSet):
    queryset = PedidoItem.objects.all()
    serializer_class = PedidoItemSerializer


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class SuscripcionViewSet(viewsets.ModelViewSet):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer
