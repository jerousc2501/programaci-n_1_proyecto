from django.db import models
from users.models import Usuario


class PerfilProfesional(models.Model):
    ESPECIALIDAD_CHOICES = [
        ('entrenador', 'Entrenador Personal'),
        ('nutricionista', 'Nutricionista'),
    ]

    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_profesional')
    especialidad = models.CharField(max_length=20, choices=ESPECIALIDAD_CHOICES)
    numero_licencia = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.get_especialidad_display()}"


class Plan(models.Model):
    TIPO_CHOICES = [
        ('entrenamiento', 'Entrenamiento'),
        ('nutricion', 'Nutrición'),
        ('mixto', 'Mixto'),
    ]

    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    profesional = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='planes_creados')
    tipo = models.CharField(max_length=15, choices=TIPO_CHOICES)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    contenido = models.JSONField(blank=True, null=True, help_text="Ejercicios o comidas en formato JSON")
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    duracion_dias = models.PositiveIntegerField(help_text="Duración del plan en días por unidad")
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='activo')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.profesional.get_full_name()}"


class PlanCliente(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('completado', 'Completado'),
        ('expirado', 'Expirado'),
        ('cancelado', 'Cancelado'),
    ]

    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='planes_adquiridos')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='compras')
    cantidad = models.PositiveIntegerField(default=1)
    precio_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_compra = models.DateTimeField(auto_now_add=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='activo')

    def __str__(self):
        return f"{self.cliente.get_full_name()} - {self.plan.nombre} (x{self.cantidad})"
