from rest_framework import viewsets
from .models import Usuario, PerfilProfesional, Plan, PlanCliente
from .serializers import (
    UsuarioSerializer, PerfilProfesionalSerializer,
    PlanSerializer, PlanClienteSerializer,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class PerfilProfesionalViewSet(viewsets.ModelViewSet):
    queryset = PerfilProfesional.objects.all()
    serializer_class = PerfilProfesionalSerializer


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class PlanClienteViewSet(viewsets.ModelViewSet):
    queryset = PlanCliente.objects.all()
    serializer_class = PlanClienteSerializer
