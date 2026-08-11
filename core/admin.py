from django.contrib import admin
from .models import Usuario, PerfilProfesional, Plan, PlanCliente


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'rol', 'telefono', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('rol',)


@admin.register(PerfilProfesional)
class PerfilProfesionalAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'especialidad')
    list_filter = ('especialidad',)


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'profesional', 'tipo', 'precio', 'duracion_dias', 'estado')
    list_filter = ('tipo', 'estado')


@admin.register(PlanCliente)
class PlanClienteAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'plan', 'cantidad', 'precio_pagado', 'fecha_inicio', 'fecha_fin', 'estado')
    list_filter = ('estado',)
