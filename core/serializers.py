from rest_framework import serializers
from .models import PerfilProfesional, Plan, PlanCliente
from users.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'telefono', 'fecha_nacimiento', 'altura', 'peso', 'rol', 'is_active']
        read_only_fields = ['id']


class UsuarioListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'telefono', 'fecha_nacimiento', 'altura', 'peso', 'rol', 'is_active']
        read_only_fields = fields


class PerfilProfesionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilProfesional
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'


class PlanClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanCliente
        fields = '__all__'
        read_only_fields = ['cliente', 'precio_pagado', 'fecha_compra', 'fecha_fin']

    def create(self, validated_data):
        plan = validated_data['plan']
        cantidad = validated_data.get('cantidad', 1)
        fecha_inicio = validated_data['fecha_inicio']

        validated_data['precio_pagado'] = plan.precio
        from datetime import timedelta
        validated_data['fecha_fin'] = fecha_inicio + timedelta(days=plan.duracion_dias * cantidad)

        return super().create(validated_data)
