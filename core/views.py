from rest_framework import permissions, viewsets
from .models import PerfilProfesional, Plan, PlanCliente, Ejercicio, RutinaPersonalizada
from users.models import Usuario
from .serializers import (
    UsuarioSerializer, UsuarioListSerializer, PerfilProfesionalSerializer,
    PlanSerializer, PlanClienteSerializer, EjercicioSerializer,
    RutinaPersonalizadaSerializer,
)
from users.permissions import (
    IsAdminOrVendedorOrReadOnly, IsAdminUserRole, IsCliente,
    IsOwnerOrReadOnly, IsAdminOrProfesionalOrReadOnly,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUserRole]

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [IsAdminOrProfesionalOrReadOnly()]
        return [IsAdminUserRole()]

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
    permission_classes = [IsAdminOrProfesionalOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(profesional=self.request.user)


class PlanClienteViewSet(viewsets.ModelViewSet):
    queryset = PlanCliente.objects.all()
    serializer_class = PlanClienteSerializer
    permission_classes = [IsCliente]

    def get_queryset(self):
        return PlanCliente.objects.filter(cliente=self.request.user)

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)


class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer
    permission_classes = [IsAdminOrProfesionalOrReadOnly]


class RutinaPersonalizadaViewSet(viewsets.ModelViewSet):
    queryset = RutinaPersonalizada.objects.all()
    serializer_class = RutinaPersonalizadaSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrProfesionalOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol == 'admin':
            return RutinaPersonalizada.objects.all()
        if user.rol == 'vendedor':
            return RutinaPersonalizada.objects.filter(profesional=user)
        return RutinaPersonalizada.objects.filter(cliente=user)

    def perform_create(self, serializer):
        serializer.save(profesional=self.request.user)
