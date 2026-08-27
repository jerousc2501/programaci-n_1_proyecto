from rest_framework import permissions, viewsets
from .models import PerfilProfesional, Plan, PlanCliente
from users.models import Usuario
from .serializers import (
    UsuarioSerializer, UsuarioListSerializer, PerfilProfesionalSerializer,
    PlanSerializer, PlanClienteSerializer,
)
from users.permissions import IsAdminOrVendedorOrReadOnly, IsAdminUserRole, IsCliente, IsOwnerOrReadOnly


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUserRole]

    def get_serializer_class(self):
        if self.action == 'list':
            return UsuarioListSerializer
        return UsuarioSerializer


class PerfilProfesionalViewSet(viewsets.ModelViewSet):
    queryset = PerfilProfesional.objects.all()
    serializer_class = PerfilProfesionalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAdminOrVendedorOrReadOnly]


class PlanClienteViewSet(viewsets.ModelViewSet):
    queryset = PlanCliente.objects.all()
    serializer_class = PlanClienteSerializer
    permission_classes = [IsCliente]

    def get_queryset(self):
        return PlanCliente.objects.filter(cliente=self.request.user)

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)
