from django.contrib import admin
from .models import (
    Usuario, Profesional, Objetivo, PlanNutricional, Comida,
    PlanEntrenamiento, Ejercicio, Medicion, ProgresoEntrenamiento,
    Producto, Carrito, Pedido, PedidoItem, Pago, Suscripcion
)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'telefono', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')

@admin.register(Profesional)
class ProfesionalAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'especialidad', 'precio_consulta')
    list_filter = ('especialidad',)

@admin.register(Objetivo)
class ObjetivoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'nombre', 'estado', 'fecha_inicio')
    list_filter = ('estado',)

@admin.register(PlanNutricional)
class PlanNutricionalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'usuario', 'profesional', 'objetivo_calorico')
    search_fields = ('nombre',)

@admin.register(Comida)
class ComidaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo', 'plan_nutricional', 'kcal')
    list_filter = ('tipo',)

@admin.register(PlanEntrenamiento)
class PlanEntrenamientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'usuario', 'tipo', 'frecuencia_semanal')
    list_filter = ('tipo',)

@admin.register(Ejercicio)
class EjercicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'plan_entrenamiento', 'musculo', 'serie', 'repeticiones')
    list_filter = ('musculo',)

@admin.register(Medicion)
class MedicionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'fecha', 'peso', 'imc')
    search_fields = ('usuario__email',)

@admin.register(ProgresoEntrenamiento)
class ProgresoEntrenamientoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'ejercicio', 'fecha', 'completado')
    list_filter = ('completado',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'stock', 'activo')
    list_filter = ('categoria', 'activo')
    search_fields = ('nombre',)

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'producto', 'cantidad')

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'fecha', 'total', 'estado')
    list_filter = ('estado',)

@admin.register(PedidoItem)
class PedidoItemAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'producto', 'cantidad', 'precio_unitario')

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'metodo', 'monto', 'estado', 'fecha_pago')
    list_filter = ('metodo', 'estado')

@admin.register(Suscripcion)
class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'tipo', 'estado', 'fecha_inicio', 'fecha_renovacion')
    list_filter = ('tipo', 'estado')
