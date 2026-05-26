from rest_framework import serializers
from .models import (
    Usuario, Profesional, Objetivo, PlanNutricional, Comida,
    PlanEntrenamiento, Ejercicio, Medicion, ProgresoEntrenamiento,
    Producto, Carrito, Pedido, PedidoItem, Pago, Suscripcion
)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'telefono', 'fecha_nacimiento', 'altura', 'peso', 'is_active']
        read_only_fields = ['id']


class ProfesionalSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)

    class Meta:
        model = Profesional
        fields = '__all__'


class ObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = '__all__'


class PlanNutricionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanNutricional
        fields = '__all__'


class ComidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comida
        fields = '__all__'


class PlanEntrenamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanEntrenamiento
        fields = '__all__'


class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'


class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'
        read_only_fields = ['imc']


class ProgresoEntrenamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoEntrenamiento
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


class CarritoSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Carrito
        fields = '__all__'

    def get_subtotal(self, obj):
        return obj.producto.precio * obj.cantidad


class PedidoItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = PedidoItem
        fields = '__all__'

    def get_subtotal(self, obj):
        return obj.precio_unitario * obj.cantidad


class PedidoSerializer(serializers.ModelSerializer):
    items = PedidoItemSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'


class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        fields = '__all__'
