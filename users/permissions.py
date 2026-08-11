from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrVendedorOrReadOnly(BasePermission):
    """Lectura publica; escritura solo para usuarios admin o vendedor."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(
            user and user.is_authenticated and user.rol in ('admin', 'vendedor')
        )


class IsCliente(BasePermission):
    """Permite acceso solo a usuarios autenticados con rol cliente."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.rol == 'cliente')


class IsAdminUserRole(BasePermission):
    """Permite acceso solo a administradores del sistema."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user and user.is_authenticated and (user.is_staff or user.rol == 'admin')
        )
