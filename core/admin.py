from django.contrib import admin
from .models import PerfilProfesional, Plan, PlanCliente, Ejercicio, RutinaPersonalizada


@admin.register(PerfilProfesional)
class PerfilProfesionalAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'especialidad', 'telefono_contacto', 'numero_licencia')
    list_filter = ('especialidad',)
    search_fields = ('usuario__username', 'usuario__email', 'telefono_contacto')


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'profesional', 'tipo', 'categoria', 'precio', 'duracion_dias', 'estado')
    list_filter = ('tipo', 'categoria', 'estado')
    search_fields = ('nombre', 'descripcion')


@admin.register(PlanCliente)
class PlanClienteAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'plan', 'cantidad', 'precio_pagado', 'fecha_inicio', 'fecha_fin', 'estado')
    list_filter = ('estado',)


@admin.register(Ejercicio)
class EjercicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'grupo_muscular')
    list_filter = ('grupo_muscular',)
    search_fields = ('nombre', 'descripcion')


@admin.register(RutinaPersonalizada)
class RutinaPersonalizadaAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'profesional', 'creado_en')
    list_filter = ('profesional', 'creado_en')
    search_fields = ('cliente__username', 'cliente__email', 'profesional__username', 'observaciones_texto')
    filter_horizontal = ('ejercicios',)
