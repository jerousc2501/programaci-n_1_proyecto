from rest_framework import serializers
from .models import PerfilProfesional, Plan, PlanCliente, Ejercicio, RutinaPersonalizada
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


class ProfesionalContactoSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()
    telefono_contacto = serializers.SerializerMethodField()
    especialidad = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'nombre', 'telefono', 'telefono_contacto', 'especialidad', 'rol',
        ]
        read_only_fields = fields

    def get_nombre(self, obj):
        return obj.get_full_name() or obj.username or obj.email

    def get_telefono(self, obj):
        perfil = getattr(obj, 'perfil_profesional', None)
        if perfil and perfil.telefono_contacto:
            return perfil.telefono_contacto
        return obj.telefono or ''

    def get_telefono_contacto(self, obj):
        return self.get_telefono(obj)

    def get_especialidad(self, obj):
        perfil = getattr(obj, 'perfil_profesional', None)
        if perfil:
            return perfil.get_especialidad_display()
        return None


class PerfilProfesionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilProfesional
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
        read_only_fields = ['profesional']

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio del plan debe ser mayor a cero.")
        return value


class PlanClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanCliente
        fields = '__all__'
        read_only_fields = ['cliente', 'precio_pagado', 'fecha_compra', 'fecha_fin']

    def create(self, validated_data):
        plan = validated_data['plan']
        cantidad = validated_data.get('cantidad', 1)
        fecha_inicio = validated_data['fecha_inicio']

        validated_data['precio_pagado'] = plan.precio * cantidad
        from datetime import timedelta
        validated_data['fecha_fin'] = fecha_inicio + timedelta(days=plan.duracion_dias * cantidad)

        return super().create(validated_data)


class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'


class RutinaPersonalizadaSerializer(serializers.ModelSerializer):
    ejercicios = serializers.PrimaryKeyRelatedField(
        queryset=Ejercicio.objects.all(),
        many=True,
        required=False,
    )
    ejercicios_detalle = EjercicioSerializer(source='ejercicios', many=True, read_only=True)
    profesional_detalle = ProfesionalContactoSerializer(source='profesional', read_only=True)

    class Meta:
        model = RutinaPersonalizada
        fields = [
            'id',
            'cliente',
            'profesional',
            'profesional_detalle',
            'ejercicios',
            'ejercicios_detalle',
            'observaciones_texto',
            'creado_en',
        ]
        read_only_fields = ['profesional', 'creado_en']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['ejercicios'] = EjercicioSerializer(instance.ejercicios.all(), many=True).data
        return representation
